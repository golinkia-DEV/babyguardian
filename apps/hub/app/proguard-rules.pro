# BabyGuardian Hub — reglas mínimas; reforzar cuando se active R8 en release.

-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
