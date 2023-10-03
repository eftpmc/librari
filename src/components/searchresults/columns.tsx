import { ColumnDef } from "@tanstack/react-table"

export type Result = {
  id: string
  title: string
  chapters: number
}

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "chapters",
    header: "Chapters",
  },
]