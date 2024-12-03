"use client";

type SectionWrapperProps = {
  children: React.ReactNode;
  reference?: React.RefObject<HTMLDivElement>;
  className?: string;
};

export default function SectionWrapper({
  children,
  reference,
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      ref={reference}
      className={`min-h-screen flex items-center justify-center py-24 ${className}`}
    >
      <div className="container px-4 md:px-6 mx-auto">{children}</div>
    </section>
  );
}