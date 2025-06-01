export const TableHeader = ({ children, className = "" }) => (
  <th
    className={`px-1.5 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-[12px] sm:text-base md:text-lg font-semibold text-[#36053A]/80 ${className}`}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = "", ...props }) => (
  <td
    className={`px-1.5 sm:px-3 md:px-4 py-2 sm:py-3 text-[12px] sm:text-base md:text-lg text-center text-[#36053A]/80 ${className}`}
    {...props}
  >
    {children}
  </td>
);

export const FormIndicator = ({ result }) => {
  const bgColor =
    result === "W" ? "#1DC347" :
    result === "D" ? "#9ca3af" :
    "#C10208";

  const title =
    result === "W" ? "Win" :
    result === "D" ? "Draw" :
    "Loss";

  return (
    <div
      className="w-3 h-3  rounded-full"
      style={{ backgroundColor: bgColor }}
      title={title}
    />
  );
};