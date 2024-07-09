import { createSlice } from "@reduxjs/toolkit";

const globalStyle = createSlice({
    name: 'globalStyle',
    initialState: {
        activeColor: '#2400FF',
        activeLightColor: '#2958FF',
        secondaryColor: '#100071',
        inactiveColor: '#353535',
        activeMono: '#BCB1FF',
        secondaryMono: '#777777',
        inactiveMono: '#353535',
        errorColor: '#FF001F',
        successColor: '#00FF75',
        borderRadius: '3px',
        borderRadius20: '20px',
        borderRadius10: '10px',
        largeDesktopFont: '27px',
        veryLargeDesktopFont: '31px',
        verySmallDesktopFont: '15px',
        titleDesktopFont: '60px',
        regularDesktopFont: '25px',
        smallDesktopFont: '17px',
        mediumDesktopFont: '21px',
        footnoteDesktopFont: '12px',
        veryLargeMobileFont: '31px',
        largeMobileFont: '19px',
        regularMobileFont: '16px',
        mediumMobileFont: '14px',
        smallMobileFont: '10px',
        footnoteMobileFont: '8px',
        theme: 'light',
    },
    reducers: {}
})


export default globalStyle.reducer;