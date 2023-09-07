import React from 'react'
import { Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './Statistics.scss'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Statistics() {

  const data = {
    labels: ['Wins', 'Loses', 'Draws'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="stats">
      <Doughnut data={data}/>
    </div>
  )
}
