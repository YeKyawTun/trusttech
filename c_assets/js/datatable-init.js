$(document).ready(function() {
    $('#community-table').DataTable({
        responsive: {
            details: {
            display: $.fn.dataTable.Responsive.display.modal( {
                    header: function ( row ) {
                        var data = row.data();
                        //return 'Details for '+data[0]+' '+data[1];
                        return 'Details';
                    }
                } ),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
                tableClass: 'table'
                } )
            }
        },
        /*
        language: {
        lengthMenu: "Show _MENU_"  // Modify this line
        
        }*/
        lengthChange: false, //This will remove the dropdown box
        pageLength: 20, //This sets the defaults number of rows per page
        ajax: {
                url: 'c_assets/data/data.json', // Replace with the path to your JSON file
                dataSrc: '' // Use an empty string if your JSON data is an array of objects
        },
        columns: [
            { data: 'Name' }, // Adjust these keys to match your JSON structure
            { data: 'Affiliated_Organization' },
            { data: 'Research_Interest' },
            { data: 'Industry_IHL' },
            { data: 'Email' }
        ]                     
    } );
} );