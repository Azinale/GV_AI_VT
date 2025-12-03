import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- IMPORTS & CONFIG ---
// Sử dụng thư viện qua CDN (đã khai báo trong index.html).
const pdfjsLib = window.pdfjsLib;
const mammoth = window.mammoth;
const $ = window.$; 

// Cấu hình Worker cho PDF.js
if (pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const Viewer = ({ activeFile, onClose }) => {
    const [zoom, setZoom] = useState(100);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0); // State mới để lưu tổng số trang
    const [fileType, setFileType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const canvasRef = useRef(null);
    const docxRef = useRef(null);
    const pptxRef = useRef(null);
    const videoRef = useRef(null);
    const renderTaskRef = useRef(null);
    const pdfDocRef = useRef(null);

    // --- HELPER FUNCTIONS ---

    const renderPdfPage = useCallback(async (pageNum) => {
        if (!pdfDocRef.current || !canvasRef.current) return;
        
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
        }

        const page = await pdfDocRef.current.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoom / 100 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        try {
            renderTaskRef.current = page.render(renderContext);
            await renderTaskRef.current.promise;
        } catch (err) {
            // Ignore rendering cancelled errors
            if (err.name !== 'RenderingCancelledException') {
                console.error(err);
            }
        }
    }, [zoom]);

    const renderPDF = useCallback((file) => {
        if (!pdfjsLib) { 
            alert("Thư viện PDF chưa được tải. Vui lòng kiểm tra kết nối mạng hoặc file index.html"); 
            setIsLoading(false); 
            return; 
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedarray = new Uint8Array(e.target.result);
            try {
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                pdfDocRef.current = pdf;
                setNumPages(pdf.numPages); // Cập nhật state numPages khi load xong
                renderPdfPage(1);
                setIsLoading(false);
                setExtractedText('');
            } catch (err) {
                console.error("PDF Render Error:", err);
                alert("Lỗi hiển thị PDF. Vui lòng thử lại.");
                setIsLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    }, [renderPdfPage]);

    const extractTextFromPdf = async (pdfDoc) => {
        if (!pdfDoc) return '';
        let fullText = '';
        try {
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const p = await pdfDoc.getPage(i);
                const content = await p.getTextContent();
                const strings = content.items.map(item => item.str || '').join(' ');
                fullText += strings + '\n\n';
            }
        } catch (err) {
            console.error('Error extracting text from PDF', err);
        }
        return fullText;
    };

    const onExtractTextClick = async () => {
        if (!pdfDocRef.current) return;
        setIsLoading(true);
        const text = await extractTextFromPdf(pdfDocRef.current);
        setExtractedText(text || '');
        setIsLoading(false);
    };

    const speakText = (text) => {
        if (!('speechSynthesis' in window)) {
            alert('Speech Synthesis API không được hỗ trợ trên trình duyệt này');
            return;
        }
        if (!text || text.trim().length === 0) {
            alert('Không có văn bản nào để đọc. Vui lòng trích xuất văn bản trước.');
            return;
        }
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => { console.error('Speech error', e); setIsSpeaking(false); };
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const renderDOCX = (file) => {
        if (!mammoth) {
            alert("Thư viện Mammoth chưa được tải.");
            setIsLoading(false);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(result => {
                    if (docxRef.current) {
                        docxRef.current.innerHTML = result.value;
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                     console.error(err);
                     setIsLoading(false);
                });
        };
        reader.readAsArrayBuffer(file);
    };

    const renderPPTX = (file) => {
        if (!$) { alert("Cần jQuery để xem PPTX (Vui lòng kiểm tra index.html)"); setIsLoading(false); return; }
        const reader = new FileReader();
        reader.onload = (e) => {
             if (pptxRef.current) {
                 pptxRef.current.innerHTML = ""; 
                 try {
                     // @ts-ignore
                     $(pptxRef.current).pptxToHtml({
                         fileInput: e.target.result,
                         slideMode: true,
                         slidesScale: 'full',
                         keyBoardShortCut: true,
                     });
                     setIsLoading(false);
                 } catch (err) {
                     console.error("PPTX Error", err);
                     setIsLoading(false);
                 }
             }
        };
        reader.readAsArrayBuffer(file);
    };
    
    // --- MAIN EFFECT ---
    useEffect(() => {
        if (!activeFile) {
            if (fileType !== null) {
                // Defer clearing state to avoid synchronous setState inside effect
                setTimeout(() => setFileType(null), 0);
            }
            return;
        }

        const processFile = async () => {
            setIsLoading(true);
            setZoom(100);
            setPage(1);
            setNumPages(0); // Reset số trang khi mở file mới

            let fileObj = activeFile;
            
            // Xử lý nếu activeFile là URL string
            if (typeof activeFile === 'string') {
                const fileName = activeFile.split('/').pop();
                const ext = fileName.split('.').pop().toLowerCase();
                setFileType(ext);
                
                try {
                    const res = await fetch(activeFile);
                    const blob = await res.blob();
                    fileObj = new File([blob], fileName, { type: res.headers.get('content-type') });
                } catch (e) {
                    console.error("Lỗi tải file", e);
                    setIsLoading(false);
                    return;
                }
            } else {
                const ext = activeFile.name.split('.').pop().toLowerCase();
                setFileType(ext);
            }

            const ext = fileObj.name.split('.').pop().toLowerCase();
            
            if (ext === 'pdf') {
                renderPDF(fileObj);
            } else if (['mp4', 'mov', 'webm'].includes(ext)) {
                setFileType('video');
                if (videoRef.current) {
                    videoRef.current.src = URL.createObjectURL(fileObj);
                    videoRef.current.play();
                }
                setIsLoading(false);
            } else if (ext === 'docx') {
                setFileType('docx');
                renderDOCX(fileObj);
            } else if (ext === 'pptx') {
                setFileType('pptx');
                renderPPTX(fileObj);
            } else {
                alert("Định dạng không hỗ trợ");
                setIsLoading(false);
                onClose();
            }
        };

        processFile();

    }, [activeFile, onClose, renderPDF, fileType]);

    // Zoom Effect
    useEffect(() => {
        if (fileType === 'pdf' && pdfDocRef.current) {
            renderPdfPage(page);
        } else if (fileType === 'docx' && docxRef.current) {
            docxRef.current.style.transform = `scale(${zoom/100})`;
            docxRef.current.style.transformOrigin = 'top center';
        }
    }, [zoom, fileType, page, renderPdfPage]);

    if (!activeFile) return null;

    return (
        <div id="viewer" style={{display: 'flex'}}>
            <button id="btnBack" onClick={onClose} style={{display: 'inline-flex'}}>
                ← Trở lại
            </button>

            <div id="stage">
                {isLoading && <div style={{padding: 20, textAlign: 'center'}}>Đang tải tài liệu...</div>}
                
                <div id="videoHolder" style={{display: fileType === 'video' ? 'block' : 'none'}}>
                    <video ref={videoRef} controls style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                </div>

                <div id="pdfHolder" style={{display: fileType === 'pdf' ? 'block' : 'none'}}>
                    <div id="pdfWrap">
                         <canvas ref={canvasRef} id="pdfCanvas"/>
                    </div>
                </div>

                <div id="docxHolder" style={{display: fileType === 'docx' ? 'block' : 'none'}}>
                     <div id="docxViewport">
                        <div id="docxScrollable">
                             <div ref={docxRef} id="docxPage" style={{padding: '40px'}}></div>
                        </div>
                     </div>
                </div>

                <div id="pptxHolder" style={{display: fileType === 'pptx' ? 'block' : 'none'}}>
                    <div ref={pptxRef} id="pptxMount"></div>
                </div>
            </div>

            {(fileType === 'pdf' || fileType === 'docx') && (
                <div id="zoomBar" style={{display: 'flex'}}>
                    <button className="btn" onClick={() => setZoom(z => Math.max(20, z - 10))}>−</button>
                    <div id="zoomLevel">{zoom}%</div>
                    <button className="btn" onClick={() => setZoom(z => Math.min(200, z + 10))}>+</button>
                    <button className="btn" onClick={() => setZoom(100)}>Đặt lại</button>
                </div>
            )}

            {fileType === 'pdf' && numPages > 0 && (
                <div id="nav" style={{display: 'flex'}}>
                    <button className="btn" onClick={() => {if(page>1) {setPage(p=>p-1); renderPdfPage(page-1);}}}>
                        ⟨ Trang trước
                    </button>
                    <span style={{padding: '0 10px', alignSelf: 'center', color: 'var(--viettel-red)', fontWeight: 'bold'}}>
                        {page} / {numPages}
                    </span>
                    <button className="btn" onClick={() => {if(page<numPages) {setPage(p=>p+1); renderPdfPage(page+1);}}}>
                        Trang tiếp ⟩
                    </button>
                </div>
            )}

            {/* PDF-specific actions: Extract Text & Read */}
            {fileType === 'pdf' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 12}}>
                    <button className="btn" onClick={onExtractTextClick}>Trích xuất văn bản</button>
                    <button className="btn" onClick={() => speakText(extractedText)}>
                        {isSpeaking ? 'Dừng đọc' : 'Đọc PDF'}
                    </button>
                </div>
            )}

            {/* Extracted text viewport */}
            {fileType === 'pdf' && extractedText && (
                <div id="extractedText" style={{marginLeft: 16, maxHeight: '60vh', overflowY: 'auto', padding: 12, border: '1px solid #ddd', background: '#fff'}}>
                    <h3 style={{marginTop: 0}}>Nội dung trích xuất</h3>
                    <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit'}}>{extractedText}</pre>
                </div>
            )}
        </div>
    );
};

export default Viewer;