// components/layouts/BookshelfLayout.tsx
import { ReactNode } from "react";

const BookshelfLayout = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-[url('../../public/image/bg-gallery.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed">
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-5xl text-white mb-4">{title}</h1>
        {children}
      </div>
    </div>
  </div>
);

export default BookshelfLayout;
