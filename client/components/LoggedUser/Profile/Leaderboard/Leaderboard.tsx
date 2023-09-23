import React from 'react'
import './Leaderboard.scss'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// import { Button } from '@radix-ui/themes'

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <Table>
        <TableHeader>
          <TableRow className='table-head'>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Wins</TableHead>
            <TableHead>Losses</TableHead>
            <TableHead>Win Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className='table-row'>
            <TableCell>1</TableCell>
            <TableCell>Player 1</TableCell>
            <TableCell>50</TableCell>
            <TableCell>20</TableCell>
            <TableCell>71.43</TableCell>
          </TableRow>
          <TableRow className='table-row'>
            <TableCell>2</TableCell>
            <TableCell>Player 2</TableCell>
            <TableCell>40</TableCell>
            <TableCell>30</TableCell>
            <TableCell>57.14</TableCell>
          </TableRow>
          <TableRow className='table-row'>
            <TableCell>3</TableCell>
            <TableCell>Player 3</TableCell>
            <TableCell>30</TableCell>
            <TableCell>40</TableCell>
            <TableCell>42.86</TableCell>
          </TableRow>
          <TableRow className='table-row'>
            <TableCell>4</TableCell>
            <TableCell>Player 4</TableCell>
            <TableCell>20</TableCell>
            <TableCell>50</TableCell>
            <TableCell>28.57</TableCell>
          </TableRow>
          <TableRow className='table-row'>
            <TableCell>5</TableCell>
            <TableCell>Player 5</TableCell>
            <TableCell>10</TableCell>
            <TableCell>60</TableCell>
            <TableCell>14.29</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
