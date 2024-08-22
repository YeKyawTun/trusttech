document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.querySelector('.closebtn');
    var navbarCollapse = document.getElementById('navbarNav');

    closeButton.addEventListener('click', function() {
        var bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: true
        });
    });
});


// Fetch the JSON data
fetch('c_assets/data/detail_data.json')
        .then(response => response.json())
        .then(data => {

            data.sort((a, b) => a.Name.localeCompare(b.Name));
                
            const row = document.querySelector('#container-2 .row'); // Select the .row inside container-2
            data.forEach(person => {
                const cardHTML = generateCardHTML(person);
                row.appendChild(cardHTML); // Append cards to the .row
            });
        });

            

function generateCardHTML(person) {
    const card = document.createElement('div');
    card.className = 'col-lg-4 col-12 card-padding';
    card.setAttribute('data-category', person.Research_Interest); // Set data attribute for filtering


    const cardContent = `
        <div class="card card-color mb-3">
            <div class="card-body">
                <h5 class="card-title">${person.Name}</h5>

                <p class="text-muted mb-0 icon-text">
                    <i class="mdi mdi-domain font-size-15 align-middle pe-2 text-primary"></i>
                    <span>${person.Affiliated_Organization}</span>
                    </p>

                <p class="text-muted mb-0 icon-text">
                    <i class="mdi mdi-focus-field font-size-15 align-middle pe-2 text-primary"></i>
                    <span>${person.Research_Interest}</span>
                </p>

                <p class="text-muted mb-0 icon-text">
                    <i class="mdi mdi-email font-size-15 align-middle pe-2 text-primary"></i>
                    <span>${person.Email}</span>
                </p>
            </div>
        </div>
    `;

               
card.innerHTML = cardContent;
return card;

                
} //generateCardHTML


        // Array of keywords for "Others" category
        const otherKeywords = [
            "Cyber Security", 
            "Human-Factors Design", 
            "Trust in Machine from social science perspectives", 
            "HCI", 
            "IoE Security", 
            "Post-Quantum Cryptography", 
            "Encryption", 
            "Authentication", 
            "Audio and Video Deep Fake Detection and Generation",
            "CISO - Leadership for Digital trust in private industry",
        ];
        
    

        function filterCards(category) {
            var cards = document.querySelectorAll('.card');
            cards.forEach(function(card) {
                var text = card.innerText;
                if (category === "Others") {
                    // Display the card if it contains any of the keywords in the 'otherKeywords' array
                    var displayCard = otherKeywords.some(keyword => text.includes(keyword));
                    card.parentElement.style.display = displayCard ? "" : "none";
                } else {
                    // For other categories or "All"
                    if (text.includes(category) || category === "All") {
                        card.parentElement.style.display = "";
                    } else {
                        card.parentElement.style.display = "none";
                    }
                }
            });
        }




        var options = {
            series: [24, 26, 18, 20, 6],
            chart: {
                type: 'donut',
                width: '100%',
                height: '400px', // Adjust as needed
            },
            title: {
                text: "This pie chart depicts the distribution of members across various areas of expertise.",
                align: 'center',
                margin: 20, // Adjust the margin as needed
                style: {
                    fontSize: '14px', // Adjust the font size as needed
                    color: '#333' // Adjust the font color as needed
                }
            },
            labels: ['Trusted Accreditation', 'Trusted Analysis', 'Trusted Compute', 'Trusted Digital ID and Web 3.0', 'Others'],
            legend: {
                position: 'bottom', // Positions the legend below the chart
                horizontalAlign: 'center', // Centers the legend
                offsetY: 8,  // Adjust this value to move the legend closer to or further from the chart
            },
            responsive: [{
                breakpoint: 4096,
                options: {
                    title: {
                        style: {
                                fontSize: '16px', // Smaller font size for better fit on smaller screens
                        }
                    },
                    chart: {
                        height: '400px'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },{
                breakpoint: 2048,
                options: {
                    title: {
                            style: {
                                fontSize: '15px', // Smaller font size for better fit on smaller screens
                        }
                    },
                    chart: {
                        height: '300px'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },{
                breakpoint: 1024,
                options: {
                    title: {
                            style: {
                                fontSize: '14px', // Smaller font size for better fit on smaller screens
                        }
                    },
                    chart: {
                        height: '300px'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }, {
                breakpoint: 768,
                options: {
                    title: {
                            style: {
                                fontSize: '12px', // Smaller font size for better fit on smaller screens
                        }
                    },
                    chart: {
                        height: '300px'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }, {
                breakpoint: 480,
                options: {
                    title: {
                            style: {
                                fontSize: '8px', // Even smaller font size for small screens
                        }
                        },
                    chart: {
                        height: '300px'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        
        var chart = new ApexCharts(document.querySelector(".donut-container"), options);
        chart.render();
        
            