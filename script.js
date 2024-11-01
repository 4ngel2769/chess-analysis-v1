// Calculate Performance, Accuracy, and Time Efficiency
function calculateMetrics(NR, NA, ST, INC, MOV, TL) {
    // Total Time Given (ST + MOV * INC)
    const T_GIVEN = ST + (MOV * INC);
    
    // Total Time Used (ST + MOV * INC - TL)
    const T_USED = T_GIVEN - TL;
    
    // Time Efficiency (TE)
    const TE = 1 - (T_USED / T_GIVEN);
    
    // Weight factors for performance calculation
    const WR = 0.3 + 0.2 * (ST + INC) / (ST + 300);
    const WA = 0.3 + 0.3 * (ST + INC) / (ST + 600);
    const WT = 0.4 * (ST + INC) / (ST + 900);
    
    // Calculate Performance Index
    const P = WR * NR + WA * NA + WT * TE;
    
    return {
        performance: P * 100, // Express as percentage
        accuracy: NA * 100, // Express as percentage
        timeEfficiency: TE * 100 // Express as percentage
    };
}

const ctx = document.getElementById('performanceChart').getContext('2d');
let performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["AR3", "AR4", "AR5", "AR6", "AR7", "AR8", "AR8T1"],
        datasets: [
            {
                label: 'Performance',
                data: [],
                borderColor: '#ff4500',
                fill: false,
                tension: 0.1,
            },
            {
                label: 'Accuracy',
                data: [],
                borderColor: '#3498db',
                fill: false,
                tension: 0.1,
            },
            {
                label: 'Time Efficiency',
                data: [],
                borderColor: '#2ecc71',
                fill: false,
                tension: 0.1,
            }
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    },
});

function updateChart(newData) {
    performanceChart.data.datasets[0].data = newData.performance;
    performanceChart.data.datasets[1].data = newData.accuracy;
    performanceChart.data.datasets[2].data = newData.timeEfficiency;
    performanceChart.update();
}

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const NR = parseFloat(document.getElementById('NR').value);
    const NA = parseFloat(document.getElementById('NA').value); // Normalized Accuracy
    const ST = parseInt(document.getElementById('ST').value);
    const INC = parseInt(document.getElementById('INC').value);
    const MOV = parseInt(document.getElementById('MOV').value);
    const TL = parseInt(document.getElementById('TL').value); // Time Left

    const rounds = performanceChart.data.labels.map((_, i) => {
        return calculateMetrics(NR, NA, ST, INC, MOV + i * 5, TL);
    });

    const performanceData = rounds.map(data => data.performance);
    const accuracyData = rounds.map(data => data.accuracy);
    const timeEfficiencyData = rounds.map(data => data.timeEfficiency);

    updateChart({
        performance: performanceData,
        accuracy: accuracyData,
        timeEfficiency: timeEfficiencyData
    });

    document.getElementById('performance-output').innerHTML = `
        <p>Latest Performance Score: ${performanceData[performanceData.length - 1].toFixed(2)}</p>
        <p>Latest Accuracy: ${accuracyData[accuracyData.length - 1].toFixed(2)}%</p>
        <p>Latest Time Efficiency: ${timeEfficiencyData[timeEfficiencyData.length - 1].toFixed(2)}%</p>
    `;
});
