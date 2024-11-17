export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex text-center justify-center items-center w-full">
        {children}
      </div>
    </section>
  );
}
