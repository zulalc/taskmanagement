import { NotebookText } from "lucide-react";

function Footer() {
  return (
    <footer
      className="py-8 px-6 text-center text-xs bg-brand-dark"
      style={{ color: "#7aada3" }}
    >
      <div className="flex items-center justify-center gap-2 mb-2 font-semibold text-sm text-white">
        <NotebookText className="w-4 h-4 text-brand-mint" />
        ZC-TASK
      </div>
      © {new Date().getFullYear()} ZC-TASK. Built for productivity and workflow
      management. All rights reserved.
    </footer>
  );
}

export default Footer;
