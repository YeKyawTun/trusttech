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
    "CISO - Leadership for Digital trust in private industry"
];


$(document).ready(function() {
    var table = $('#community-table').DataTable({
        responsive: true,
        lengthChange: false,
        pageLength: 20,
        ajax: {
            url: 'c_assets/data/detail_data.json',
            dataSrc: '',
            complete: function(data) {
                // Populate dropdowns after data is loaded
                populateDropdowns(table);
            }
        },
        columns: [
            { data: 'Name' },
            { data: 'Affiliated_Organization' },
            { data: 'Research_Interest' },
            { data: 'Industry_IHL' },
            { data: 'Email' }
        ]
    });

    function populateDropdowns(table) {
        // Populate Affiliated Organization dropdown
        var column = table.column(1); // Assuming Affiliated Organization is the second column
        var select = $('#filter-aff-org').on('change', function() {
            table.draw();
        });

        column.data().unique().sort().each(function(d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
        });

        // Attach change event to Research Interest and Industry/IHL filters
        $('#filter-research-int, #filter-industry').on('change', function() {
            table.draw();
        });
    }

    populateDropdowns(table);

    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var affOrg = $('#filter-aff-org').val();
            var researchInt = $('#filter-research-int').val();
            var industry = $('#filter-industry').val();

            var isAffOrgMatch = (affOrg === "") || (data[1] === affOrg) ;
            var isIndustryMatch = (industry === "") || (data[3] === industry);
            var isResearchIntMatch = true; // Default to true

            if (researchInt !== "") {
                if (researchInt === "Others") {
                    isResearchIntMatch = otherKeywords.some(keyword => data[2].includes(keyword));
                } else if (researchInt !== "ALL") { // Handle other specific options
                    switch(researchInt) {
                        case "Trusted Analysis":
                        case "Trusted Digital ID and Web 3.0":
                        case "Trusted Compute":
                        case "Trusted Accreditation":
                            isResearchIntMatch = data[2].includes(researchInt);
                            break;
                        default:
                            isResearchIntMatch = (data[2] === researchInt);
                    }
                }
            }

            return isAffOrgMatch && isResearchIntMatch && isIndustryMatch;
        }
    );



});