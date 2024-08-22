<?php

include('db.php');

    // Check if all required POST data is set and not empty
    if (
        !empty($_POST['f_firstname']) && !empty($_POST['f_lastname']) && !empty($_POST['f_gender']) &&
        !empty($_POST['f_email']) && !empty($_POST['f_affiliated_organization']) && !empty($_POST['f_research_interest']) &&
        !empty($_POST['f_area']) && !empty($_POST['flexRadioDefault']) && !empty($_POST['flexRadioDefault1'])
       ) 
       {


        // Database connection
        $conn = getDbConnection();


        // Trim and sanitize the POST data
        $firstname          =  mysqli_real_escape_string($conn, trim($_POST['f_firstname']));
        $lastname           =  mysqli_real_escape_string($conn, trim($_POST['f_lastname']));
        $gender             =  mysqli_real_escape_string($conn, trim($_POST['f_gender']));
        $email              =  mysqli_real_escape_string($conn, trim($_POST['f_email']));
        $affiliated_org     =  mysqli_real_escape_string($conn, trim($_POST['f_affiliated_organization']));
        $research_interest  =  mysqli_real_escape_string($conn, trim($_POST['f_research_interest']));
        $area               =  mysqli_real_escape_string($conn, trim($_POST['f_area']));
        $radio_consent      =  mysqli_real_escape_string($conn, trim($_POST['flexRadioDefault']));
        $radio_Info         =  mysqli_real_escape_string($conn, trim($_POST['flexRadioDefault1']));
		

        try {
            // Check if the user is already registered
            $stmt = $conn->prepare("SELECT * FROM registration_form WHERE email = ?");
            
            if ($stmt) 
            {
            
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                $stmt->close();

                if ($result->num_rows > 0) 
                {
                    echo "User is already existed";
                } 
                else 
                {

                    // Insert the new user into the database
                    $stmt = $conn->prepare("INSERT INTO registration_form(firstname, lastname, gender, email, affiliated_org, research_interest, area, consent, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                    if($stmt) 
                    {
                        $stmt->bind_param("sssssssss", $firstname, $lastname, $gender, $email, $affiliated_org, $research_interest, $area, $radio_consent, $radio_Info);
                    
                        if ( $stmt->execute() ) 
                        {
                            echo "Registration successfully...";
                        } 
                        else 
                        {
                            echo "There is a technical error. !Please try again.";
                        }

                        $stmt->close();
                    }
                    else 
                    {
                        echo "Failed to prepared statement. Please try again.";
                    }
                }
            }
            else 
            {
                echo "Failed to prepared statement. Please try again.";
            }
        } finally {
            // Close the connection regardless of whether an exception was thrown
            if ($conn && $conn instanceof mysqli) {
                $conn->close();
            }
        }
    } else {
        echo "No Data";

    }

?>
