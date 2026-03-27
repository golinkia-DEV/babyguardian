package cl.babyguardian.hub.ui.screens.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LastFeedingInfo(
    val timeAgo: String,
    val nextIn: String,
)

data class DashboardUiState(
    val babyName: String = "Mi Bebé",
    val babyAge: String = "",
    val babyState: BabyState = BabyState.CALM,
    val cameraConnected: Boolean = false,
    val lastFeeding: LastFeedingInfo? = null,
    val isLoading: Boolean = false,
)

@HiltViewModel
class DashboardViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    fun activateWhiteNoise() {
        viewModelScope.launch {
            // Trigger white noise playback via BabyMonitorService
        }
    }

    fun updateBabyState(state: BabyState) {
        _uiState.value = _uiState.value.copy(babyState = state)
    }
}
