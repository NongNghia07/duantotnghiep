//package bangiay.com.service.impl;
//
//import bangiay.com.service.EmailService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//@Service("emailService")
//public class EmailServiceimpl implements EmailService {
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Async
//    public void sendEmail(SimpleMailMessage email) {
//        mailSender.send(email);
//    }
//}
