import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Award, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CertificateGenerator({ userName = 'Valued Attendee', eventName = 'Annual Tech Conference 2026', date = new Date().toLocaleDateString() }) {
  const certificateRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-50 dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 overflow-x-auto flex justify-center"
      >
        <div 
          ref={certificateRef}
          className="relative min-w-[800px] w-[800px] h-[565px] bg-white border-[12px] border-double border-amber-600/80 p-12 flex flex-col items-center justify-center text-center shadow-xl"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 0%, #fef3c7 100%)' }}
        >
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-amber-600 opacity-50"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-amber-600 opacity-50"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-amber-600 opacity-50"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-amber-600 opacity-50"></div>
          
          <Award className="w-16 h-16 text-amber-600 mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl font-serif font-bold text-slate-800 uppercase tracking-widest mb-2">Certificate</h1>
          <h2 className="text-xl font-serif text-amber-700 tracking-wider mb-8">OF ATTENDANCE</h2>
          <p className="text-slate-500 italic mb-4">This proudly certifies that</p>
          
          <div className="w-3/4 border-b-2 border-slate-300 pb-2 mb-6">
            <h3 className="text-3xl font-bold text-slate-800 font-serif">{userName}</h3>
          </div>
          
          <p className="text-slate-500 italic mb-4">has successfully participated in the event</p>
          <h4 className="text-2xl font-bold text-indigo-900 mb-12">{eventName}</h4>
          
          <div className="flex justify-between w-full px-12 mt-auto">
            <div className="text-center w-40">
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-700">{date}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Date</div>
            </div>
            
            <div className="text-center w-40">
              <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-700 text-lg">Eventra Admin</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Organizer Signature</div>
            </div>
          </div>
        </div>
      </motion.div>

      <button 
        onClick={generatePDF}
        disabled={isGenerating}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1"
      >
        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        {isGenerating ? "Generating High-Res PDF..." : "Download Official Certificate"}
      </button>
    </div>
  );
}
