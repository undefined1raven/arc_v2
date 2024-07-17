import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";


function KeyboarDismissWrapper({ children }) {
    return (
        <GestureHandlerRootView>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                {children}
            </ScrollView>
        </GestureHandlerRootView>
    )
}


export { KeyboarDismissWrapper }