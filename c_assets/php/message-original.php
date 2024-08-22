<?php
  $name = htmlspecialchars($_POST['name']);
  $email = htmlspecialchars($_POST['email']);
  $subject = htmlspecialchars($_POST['subject']);
  $message = htmlspecialchars($_POST['message']);

  if(!empty($email) && !empty($message)){
    if(filter_var($email, FILTER_VALIDATE_EMAIL)){

      //The email routing is to set to "Remote Mail Exchanger".
      //reviously it was set to "Local Mail Exchanger", causing not able to receive HTML form data. 

      //Reference article 
      //https://ae.godaddy.com/help/change-my-email-routing-for-linux-hosting-12380
      
      $receiver = "support@yekyawtun.com"; //enter that email address where you want to receive all messages
      $subject = "$subject";
      $body = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";
      $sender = "From: $email";
      if(mail($receiver, $subject, $body, $sender)){
         echo "Your message has been sent";
      }else{
         echo "Sorry, failed to send your message!";
      }
    }else{
      echo "Enter a valid email address!";
    }
  }else{
    echo "Email and message field is required!";
  }
?>
