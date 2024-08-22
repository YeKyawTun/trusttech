<?php
session_start();

// This script is responsible for token validation.

/* v1.8 Generate a new CSRF token for each form rendering to enhance security
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
*/

// CSRF Protection: Validate the CSRF token on form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $logFilePath = 'validateToken.log'; // Specify the correct path to your log file

  // Prepare the log messages
  $sessionTokenLog = 'Session token: ' . ($_SESSION['csrf_token'] ?? 'Not available') . " at " . date('Y-m-d H:i:s');
  $submittedTokenLog = 'Submitted token: ' . ($_POST['csrf_token'] ?? 'Not submitted') . " at " . date('Y-m-d H:i:s');

  // Log CSRF tokens for comparison
  file_put_contents($logFilePath, $sessionTokenLog . PHP_EOL, FILE_APPEND);
  file_put_contents($logFilePath, $submittedTokenLog . PHP_EOL, FILE_APPEND);

  if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    // Log the mismatch
    $mismatchLog = 'CSRF token mismatch - Session token: ' . ($_SESSION['csrf_token'] ?? 'Not available') . ', Submitted token: ' . ($_POST['csrf_token'] ?? 'Not submitted') . " at " . date('Y-m-d H:i:s');
    file_put_contents($logFilePath, $mismatchLog . PHP_EOL, FILE_APPEND);

    die('CSRF token mismatch. Please refresh webpage.');
  }
}

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

if (!empty($email) && !empty($message) && !empty($name) && !empty($subject)) {
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Extract domain from email
        $domain = substr(strrchr($email, "@"), 1);
        // Check if the domain has MX records
        if (checkdnsrr($domain, 'MX')) {
            // Proceed with email sending if domain verification is successful
            $receiver = "support@yekyawtun.com"; // Receiver email address
            $senderEmail = "no-reply@yekyawtun.com"; // Sender email address (fixed)
            $supportHeaders = "From: $senderEmail\r\n";
            $supportHeaders .= "Reply-To: $email\r\n"; // Safe way to include sender's email
            $body = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";

            // Send email to support
            if (mail($receiver, $subject, $body, $supportHeaders)) {
                // Prepare the automatic reply
                $autoReplySubject = "Confirmation: We Received Your Message";
                $autoReplyMessage = "Thank you very much for reaching out to us. We will get back to you as soon as possible.";
                $autoReplyHeaders = "From: support@yekyawtun.com\r\n";
                $autoReplyHeaders .= "MIME-Version: 1.0\r\n";
                $autoReplyHeaders .= "Content-type: text/plain; charset=UTF-8\r\n";

                // Send the automatic reply to the user
                if (mail($email, $autoReplySubject, $autoReplyMessage, $autoReplyHeaders)) {
                    // After mail is sent successfully
                    echo "Your message has been sent. ";
                } else {
                    // If unable to send a confirmation email
                    echo "Your message has been sent, but we were unable to send a confirmation email.";
                }
            } else {
                // If mail function fails
                echo "Sorry, failed to send your message!"; 
            }
        } else {
            // For invalid email domain
            echo "The email domain does not exist. Please enter a valid email address!";
        }
    } else {
        // For invalid email format
        echo "Enter a valid email address!";
    }
} else {
    // If required fields are missing
    echo "Please fill out the required fields.";
}

// Refresh the CSRF token after successful form processing
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>
