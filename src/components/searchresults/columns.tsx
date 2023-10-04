import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export type Result = {
  title: string
  url: string
  chapters: number
}

export const columns: ColumnDef<Result>[] = [
  {
    id: "select",
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => {
          // If the row is being selected, first deselect all rows
          if (value) {
            table.toggleAllRowsSelected(false);
          }
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "chapters",
    header: "Chapters",
  },
]