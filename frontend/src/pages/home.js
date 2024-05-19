import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js library
import Header from '../components/header'; // Import Header component
import Footer from '../components/footer'; // Import Footer component
import '../css/home.css';

const Home = () => {
  const [orderStatusCounts, setOrderStatusCounts] = useState({});
  const [incomeData, setIncomeData] = useState([]);
  const [ordersPerDayData, setOrdersPerDayData] = useState([]);
  const [servicesAvailedData, setServicesAvailedData] = useState([]);
  const [loadTypesData, setLoadTypesData] = useState([]);

  // Refs to store Chart instances
  const incomeChartRef = useRef(null);
  const servicesAvailedChartRef = useRef(null);
  const ordersPerDayChartRef = useRef(null);
  const loadTypesChartRef = useRef(null);

  useEffect(() => {
    // Fetch data for order status counts
    axios.get('http://localhost:3000/order/statusCounts')
      .then(response => {
        setOrderStatusCounts(response.data);
      })
      .catch(error => {
        console.error("Error fetching order status counts:", error);
      });

    // Fetch data for income
    axios.get("http://localhost:3000/order/income")
      .then(response => {
        setIncomeData(response.data);
      })
      .catch(error => {
        console.error("Error fetching income data:", error);
      });

    // Fetch data for orders per day in a week
    axios.get("http://localhost:3000/order/ordersPerDay")
      .then(response => {
        setOrdersPerDayData(response.data);
      })
      .catch(error => {
        console.error("Error fetching orders per day data:", error);
      });

    // Fetch data for services availed
    axios.get("http://localhost:3000/order/servicesAvailed")
      .then(response => {
        setServicesAvailedData(response.data);
      })
      .catch(error => {
        console.error("Error fetching services availed data:", error);
      });

    // Fetch data for load types distribution
    axios.get("http://localhost:3000/order/loadTypes")
      .then(response => {
        setLoadTypesData(response.data);
      })
      .catch(error => {
        console.error("Error fetching load types data:", error);
      });

  }, []);

  useEffect(() => {
    // Function to destroy the existing Chart instance
    const destroyChart = (chartRef) => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };

    // Draw charts here using orderStatusCounts, incomeData, ordersPerDayData, servicesAvailedData, and loadTypesData

    // Example: Draw line chart for income data
    if (incomeData.length > 0) {
      const incomeChartCtx = document.getElementById('incomeChart').getContext('2d');

      // Fill in missing months with zero values
      const filledIncomeData = fillMissingMonths(incomeData);
      
      // Get the current year
      const currentYear = new Date().getFullYear(); // Define currentYear variable

      destroyChart(incomeChartRef);

      // Create a new Chart instance for income chart
      incomeChartRef.current = new Chart(incomeChartCtx, {
        type: 'line',
        data: {
          labels: filledIncomeData.map(data => {
            // Format the month from the database with abbreviation
            const date = new Date(`${data.year}-${data.month}-01`);
            return date.toLocaleString('default', { month: 'short' });
          }),
          datasets: [{
            label: 'Income',
            data: filledIncomeData.map(data => data.totalAmount), // Total amount data
            borderColor: '#0A57A2',
            backgroundColor: 'rgba(0, 0, 255, 0.1)', // Background color for area under the line
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Monthly Income',
              padding: { bottom: 0 },
              padding: {top:20},
              font: {
                size: 20,
              }
            },
            subtitle: {
              display: true,
              text: `Year: ${currentYear}`, // Display the current year
              padding: { top: 10 },
              padding: {top:20},
              font: {
                size: 20,
              }
            }
          }
        }
      });
    }

    // Draw pie chart for services availed data
    if (servicesAvailedData.length > 0) {
      const servicesAvailedChartCtx = document.getElementById('servicesAvailedChart').getContext('2d');
      const serviceLabels = servicesAvailedData.map(data => data.serviceAvailed);
      const serviceCounts = servicesAvailedData.map(data => data.count);
    
      destroyChart(servicesAvailedChartRef);
    
      // Create a new Chart instance for services availed chart
      servicesAvailedChartRef.current = new Chart(servicesAvailedChartCtx, {
        type: 'doughnut', // Changed to doughnut
        data: {
          labels: serviceLabels,
          datasets: [{
            label: 'Number of Orders',
            data: serviceCounts,
            backgroundColor: ['#56AAF0', '#0A57A2', '#64CAF4'], // Colors for each service
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Availed Services ', // Add title if needed
              padding: { bottom: 20 },
              padding: {top:20},
              font: {
                size: 20,
              }
            }
          }
        }
      });
    }
    

  // Draw bar chart for orders per day data
if (ordersPerDayData.length > 0) {
  // Create an array to store counts for each day of the week (initialized with zeros)
  const countsByDayOfWeek = [0, 0, 0, 0, 0, 0, 0]; // [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]

  // Iterate over each item in ordersPerDayData
  ordersPerDayData.forEach(item => {
    const date = new Date(item._id); // Convert the date string to a Date object
    const dayOfWeek = date.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    countsByDayOfWeek[dayOfWeek] += item.count; // Add the count to the corresponding day of the week
  });

  // Create chart
  const ordersPerDayChartCtx = document.getElementById('ordersPerDayChart').getContext('2d');
  destroyChart(ordersPerDayChartRef);

  ordersPerDayChartRef.current = new Chart(ordersPerDayChartCtx, {
    type: 'bar',
    data: {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Labels for x-axis
      datasets: [{
        label: 'Orders per Day',
        data: countsByDayOfWeek, // Use the counts for each day of the week
        backgroundColor: '#0A57A2',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Orders'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Day of the Week'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Daily Orders',
          padding: { bottom: 20 },
          padding: {top:20},
          font: {
            size: 20,
          },
         
        }
        
      }
    }
  });
}


    // Draw pie chart for load types data
    if (loadTypesData.length > 0) {
      const loadTypesChartCtx = document.getElementById('loadTypesChart').getContext('2d');
      const loadTypeLabels = loadTypesData.map(data => data.loadType);
      const loadTypeCounts = loadTypesData.map(data => data.count);

      destroyChart(loadTypesChartRef);

      // Create a new Chart instance for load types chart
      loadTypesChartRef.current = new Chart(loadTypesChartCtx, {
        type: 'pie',
        data: {
          labels: loadTypeLabels,
          datasets: [{
            label: 'Load Types Distribution',
            data: loadTypeCounts,
            backgroundColor: ['#56AAF0', '#0A57A2'], // Colors for regular and heavy load types
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Load types',
              padding: { bottom: 20 },
              padding: {top:20},  
              font: {
                size: 20,
              }
            }
          }
        }
      });
    }
  }, [incomeData, ordersPerDayData, servicesAvailedData, loadTypesData]);

  // Function to fill missing months with zero values
  const fillMissingMonths = (data) => {
    const filledData = [];
    const currentYear = new Date().getFullYear();
    for (let month = 1; month <= 12; month++) {
      const existingData = data.find(item => item.year === currentYear && item.month === month);
      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({ year: currentYear, month, totalAmount: 0 });
      }
    }
    return filledData;
  };

  return (
    <div>
      <Header />

      
      <div>
        <div className="jumbotron" >
          <h1>Welcome to Laba-Duhhhh</h1>
          <p>We provide top-notch laundry services</p>
          <a href="/labaduh/order/new" className="btn btn-primary btn-lg" style={{marginLeft:'-1580px'}}>Place an Order</a>
        </div>

        <div className="container" style={{marginTop:'0px', marginBottom:'50px'}}>
          <div className="row chart-row">
            
            <div className="col-md-6" >
              <div className="chart-container">
                <h2 className="text-center"></h2>
                <canvas id="incomeChart"
                style={{border:'2px solid black' }}></canvas>
              </div>
            </div>

            <div className="col-md-6">
              <div className="chart-container">
                <h2 className="text-center"></h2>
                <canvas id="ordersPerDayChart"
                style={{border:'2px solid black' }}></canvas>
              </div>
            </div>


            <div className="col-md-6" style={{marginTop:'-14px', marginRight:'-170px'}}>
              <div className="chart-container" style={{width:'70%'}}>
                  <h2 className="text-center"></h2>
                  <canvas id="loadTypesChart" 
                  style={{border:'2px solid black' }}></canvas>
              </div>
            </div>


            <div className="col-md-6" style={{marginTop:'-14px'}}>
              <div className="chart-container" style={{width:'70%'}}>
                <h2 className="text-center"></h2>
                <canvas id="servicesAvailedChart"
                style={{border:'2px solid black' }}></canvas>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="rowww" >
        <ul>
      
          <div className="col-md-4">
            <div className="home-card">
              <div className="h-card-body">
                <h5 className="h-card-title">Pending Orders</h5>
                <p className="h-card-text">{orderStatusCounts.pending || 0}</p>
              </div>
            </div>
          </div>
        </ul>

        <ul>
          <div className="col-md-4">
            <div className="home-card">
              <div className="h-card-body">
                <h5 className="h-card-title">Orders Ready for Pickup</h5>
                <p className="h-card-text">{orderStatusCounts['ready for pick-up'] || 0}</p>
              </div>
            </div>
          </div>
        </ul>

        <ul>
          <div className="col-md-4">
            <div className="home-card">
              <div className="h-card-body">
                <h5 className="h-card-title">Picked-up Orders</h5>
                <p className="h-card-text">{orderStatusCounts['picked-up'] || 0}</p>
              </div>
            </div> 
          </div> 
        </ul>
      </div>

          <div className="lower-portion">
      
          </div>
      <Footer /> {/* Include Footer component */}
    </div>
  );
};

export default Home;
