<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);
    $to = "support@raigroups.in";
    $subject = "Contact Form Message";
    $body = "Name: $name\nEmail: $email\nMessage: $message";
    $headers = "From: $email\r\nReply-To: $email\r\n";
    if (mail($to, $subject, $body, $headers)) {
        echo "<p style='color:green;text-align:center;'>Message sent!</p>";
    } else {
        echo "<p style='color:red;text-align:center;'>Failed to send message. Please try again later.</p>";
    }
}
?>
<form method="POST" action="contact.php">
  <label for="name">Name</label>
  <input type="text" id="name" name="name" required/>

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required/>

  <label for="message">Message</label>
  <textarea id="message" name="message" rows="5" required></textarea>

  <button type="submit">Send Message</button>
</form>
