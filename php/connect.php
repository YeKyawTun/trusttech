<?php

include('db.php');

if (!empty($_POST['f_firstname']) && !empty($_POST['f_gender']) &&
    !empty($_POST['f_email']) && !empty($_POST['f_affiliated_organization']) && !empty($_POST['f_research_interest']) &&
    !empty($_POST['f_area']) && !empty($_POST['flexRadioDefault']) && !empty($_POST['flexRadioDefault1'])) {

    $conn = getDbConnection();
    if (!$conn) {
        echo "Failed to connect to database: " . mysqli_connect_error();
        exit;
    }

    $firstname = mysqli_real_escape_string($conn, trim($_POST['f_firstname']));
    $lastname = isset($_POST['f_lastname']) ? mysqli_real_escape_string($conn, trim($_POST['f_lastname'])) : '';
    $gender = mysqli_real_escape_string($conn, trim($_POST['f_gender']));
    $email = mysqli_real_escape_string($conn, trim($_POST['f_email']));
    $affiliated_org = mysqli_real_escape_string($conn, trim($_POST['f_affiliated_organization']));
    $research_interest = mysqli_real_escape_string($conn, trim($_POST['f_research_interest']));
    $area = mysqli_real_escape_string($conn, trim($_POST['f_area']));
    $radio_consent = mysqli_real_escape_string($conn, trim($_POST['flexRadioDefault']));
    $radio_Info = mysqli_real_escape_string($conn, trim($_POST['flexRadioDefault1']));

    try {
        $stmt = $conn->prepare("SELECT * FROM registration_form WHERE email = ?");
        if (!$stmt) {
            echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
            exit;
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->store_result(); // Store result to check rows
        if ($stmt->num_rows > 0) {
            echo "User already exists";
            $stmt->close();
        } else {
            $stmt->close(); // Close the previous statement

            $stmt = $conn->prepare("INSERT INTO registration_form (firstname, lastname, gender, email, affiliated_org, research_interest, area, consent, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            if (!$stmt) {
                echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
                exit;
            }

            $stmt->bind_param("sssssssss", $firstname, $lastname, $gender, $email, $affiliated_org, $research_interest, $area, $radio_consent, $radio_Info);

            if ($stmt->execute()) {
                echo "Registration successful...";
            } else {
                echo "Error: (" . $stmt->errno . ") " . $stmt->error;
            }

            $stmt->close();
        }
    } catch (Exception $e) {
        echo "An error occurred: " . $e->getMessage();
    } finally {
        if ($conn) {
            $conn->close();
        }
    }
} else {
    echo "No Data Provided";
}

?>
