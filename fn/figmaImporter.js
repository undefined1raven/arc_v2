const isMobile = true;


function getPositionSizeStyles(figmaImport, figmaImportConfig) {
    function locationSizeOutputCompute(value, ref) {
        if (value != undefined && ref != undefined) {
            return `${(parseFloat(value) * 100) / ref}%`;
        }
    }

    function figmaConfigPropParser(key, value, ref) {
        var out = {}
        if (value != undefined) {
            let valueLen = value.toString().length;
            if (value.toString().substring(valueLen - 1, valueLen) == '%') {
                return out[key] = value;
            }
            if (parseFloat(value) != NaN) {
                let outputValue = locationSizeOutputCompute(parseFloat(value), ref);
                return out[key] = outputValue;
            }
        } else {
            return out[key] = 'auto';
        }
    }

    function figmaImportDynamicValueGetter(key) {
        let desktopConfig = figmaImport['desktop'];
        let mobileConfig = figmaImport['mobile'];
        if (isMobile) {
            if (mobileConfig) {
                if (mobileConfig[key] != undefined) {
                    return mobileConfig[key];
                } else {
                    if (desktopConfig) {
                        if (desktopConfig[key]) {
                            return desktopConfig[key];
                        } else {
                            return undefined;
                        }
                    } else {
                        return undefined;
                    }
                }
            } else {
                if (desktopConfig) {
                    if (desktopConfig[key]) {
                        return desktopConfig[key];
                    } else {
                        return undefined;
                    }
                } else {
                    return undefined;
                }
            }
        } else {
            if (desktopConfig != undefined) {
                if (desktopConfig[key]) {
                    return desktopConfig[key];
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        }
    }

    let output = {};
    const widthOut = figmaConfigPropParser(
        'width',
        figmaImportDynamicValueGetter('width'),
        figmaImportConfig.containerWidth
    );
    const leftOut = figmaConfigPropParser(
        'left',
        figmaImportDynamicValueGetter('left'),
        figmaImportConfig.containerWidth
    );

    const heightOut = figmaConfigPropParser(
        'height',
        figmaImportDynamicValueGetter('height'),
        figmaImportConfig.containerHeight
    );
    
    const topOut = figmaConfigPropParser(
        'top',
        figmaImportDynamicValueGetter('top'),
        figmaImportConfig.containerHeight
    );
    output = {width: widthOut, top: topOut, left: leftOut, height: heightOut};
    return output;
}


export default getPositionSizeStyles;