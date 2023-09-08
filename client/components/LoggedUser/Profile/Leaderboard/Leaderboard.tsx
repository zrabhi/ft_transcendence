import React from 'react'
import { Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/react";
import './Leaderboard.scss'

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <Table>
        <TableHeader>
          <TableRow>
            <TableColumn>Rank</TableColumn>
            <TableColumn>Username</TableColumn>
            <TableColumn>Xp</TableColumn>
            <TableColumn>Wins</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>John</TableCell>
            <TableCell>1000</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
