import { useWindowDimensions } from "react-native";
import { RangeScaler } from "./RangeScaler";


function fontController(verticalFont, horizontalFont, desktopFont) {
    const { width, height } = useWindowDimensions();
    if (true) {
        let orientation = height > width ? 'portrait' : 'landscape';
        if (orientation == 'portrait') {
            if (verticalFont) {
                return fontSize =
                    (verticalFont * width) / 360;
            } else {
                return fontSize = '1.4vh';
            }
        } else {
            if (horizontalFont != undefined) {
                return fontSize =
                    (horizontalFont * width) /
                    640;
            } else {
                return 14;
            }
        }
    } else {
        let rawFontSize;
        if (desktopFont != undefined) {
            rawFontSize =
                (parseFloat(desktopFont.substring(0, desktopFont.length - 2)) * height) / 1080;
            return fontSize = rawFontSize;
        } else {
            return fontSize = '18px';
        }
        if (width < 700 && rawFontSize && !isMobile()) {
            return fontSize = parseFloat(rawFontSize - RangeScaler(rawFontSize, 10, 48, 0, 18));
        }
    }
}

export { fontController }