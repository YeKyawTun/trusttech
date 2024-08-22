<?php
session_start();

header('Content-Type: application/json');

// Reading email configurations from mailingcredential.ini
$configs = parse_ini_file("../config/mailingconfig.ini");
$receiver = $configs['receiverEmail'];
$senderEmail = $configs['defaultSender'];

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        echo json_encode(['status' => 'error', 'message' => 'CSRF token mismatch. Please refresh the webpage.']);
        exit;
    }

    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');  
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL); 
    $subject = htmlspecialchars($_POST['subject'], ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8');

    if (!empty($email) && !empty($message) && !empty($name) && !empty($subject)) {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $domain = substr(strrchr($email, "@"), 1);
            if (checkdnsrr($domain, 'MX')) {
                $supportHeaders = "From: $senderEmail\r\nReply-To: $email\r\n";
                $body = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";

                if (mail($receiver, $subject, $body, $supportHeaders)) {
                    // Success: Send automatic reply
                    $autoReplySubject = "Confirmation: We Received Your Message";
                    $autoReplyMessage = "Thank you very much for reaching out to us. We will get back to you as soon as possible.";
                    $autoReplyHeaders = "From: $receiver\r\nMIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";
                    mail($email, $autoReplySubject, $autoReplyMessage, $autoReplyHeaders);

                    echo json_encode(['status' => 'success', 'message' => 'Your message has been sent.']);
                } else {
                    $errorMsg = "Sorry, failed to send your message. Error: " . error_get_last()['message'];
                    error_log($errorMsg);
                    echo json_encode(['status' => 'error', 'message' => $errorMsg]);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'The email domain does not exist. Please enter a valid email address.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Enter a valid email address.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Please fill out all required fields.']);
    }
    
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); // Refresh the CSRF token
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>
