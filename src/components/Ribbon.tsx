type RibbonProps = {
  label: string;
  withTail?: boolean;
};

const Ribbon = ({ label, withTail = true }: RibbonProps) => {
  if (!label) return null;

  return (
    <div className="relative -right-4 overflow-visible">
      <div className="ribbon relative bg-[#3f4b2b] px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
        {label}
      </div>

      {withTail && (
        <div className="ribbon-tail w-4 h-4 bg-primary-darkened absolute right-0 -bottom-4" />
      )}
    </div>
  );
};

export default Ribbon;
