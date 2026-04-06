package cl.babyguardian.hub.data.local

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun mapToString(map: Map<String, Any>?): String? {
        return map?.let { gson.toJson(it) }
    }

    @TypeConverter
    fun stringToMap(value: String?): Map<String, Any>? {
        return value?.let {
            gson.fromJson(it, object : TypeToken<Map<String, Any>>() {}.type)
        }
    }
}
