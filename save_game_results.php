<?php
// Retrieve form data
$employeeName = $_POST['employeeName'];
$department = $_POST['department'];
$buttonChoices = $_POST['buttonChoices'];

// Compose email message
$message = "Employee Name: " . $employeeName . "\n";
$message .= "Department: " . $department . "\n";


$message .= "\nButton Choices:\n";
foreach ($buttonChoices as $buttonId => $buttonValue) {
  $message .= $buttonId . ": " . $buttonValue . "\n";
}

// Set email headers
$headers = "From: deemaadle@gamilcom"; // Replace with your actual email address

// Send email
$to = "deemaadle@gamil.com"; // Replace with the recipient's email address
$subject = "Game Results";
$mailSent = mail($to, $subject, $message, $headers);

// Check if the email was sent successfully
if ($mailSent) {
  echo "success";
} else {
  echo "error";
}
?>