# Firebase
-keep class com.google.firebase.** { *; }
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# Retrofit
-keep class com.squareup.retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**

# JSON parsing
-keep class com.google.gson.** { *; }
-keepattributes SerializedName

# AndroidX
-keep class androidx.** { *; }

# Application classes
-keep class com.babyguardian.mobile.** { *; }
-keep public class com.babyguardian.mobile.MainActivity { *; }

# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
