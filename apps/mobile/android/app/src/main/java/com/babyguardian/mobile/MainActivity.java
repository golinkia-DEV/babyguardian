package com.babyguardian.mobile;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

/**
 * MainActivity para React Native
 * Este es el punto de entrada de la aplicación nativa Android
 */
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Aquí se inicializa React Native si es necesario
        // O la interfaz nativa si es purely native
    }
}
