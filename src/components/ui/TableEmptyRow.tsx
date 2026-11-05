export function TableEmptyRow({
  colSpan,
  message = "No results found.",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="h-16 border border-[#e8eef6] px-4 text-center align-middle text-sm text-[#5b6b85]"
      >
        {message}
      </td>
    </tr>
  );
}
