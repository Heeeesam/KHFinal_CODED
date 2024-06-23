package kh.coded.services;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.ServletContext;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class ThumbNailService {

    @Autowired
    private ServletContext servletContext;

    public byte[] getThumbNail(String fileName) throws java.io.IOException {
        String realPath = servletContext.getRealPath("images");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Thumbnails.of(realPath + "/" + fileName)
                .size(250, 350)
                .toOutputStream(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }

}
