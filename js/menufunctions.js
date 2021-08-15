//======================================================================================================================
/**
 * @file    menufunctions.js
 * @author  cammatsui
 * @date    2021
 */
//======================================================================================================================



//======================================================================================================================
// Radio button sets with sliders
const radioValueToSliderValue = {
    'clumped' : 'resource-slider',
    'resource-variance' : 'number-slider-resource',
    'settlement-resource-variance' : 'number-slider-settlement'
};

// Options for Resource Slider
const resourceOptions = {
    nonSliderOptions : ['tiles-random'],
    sliderDiv : 'resource-slider-div',
    slider : 'resource-slider'
};

// Options for Number Slider - Resource Distribution
const numberResourceOptions = {
    nonSliderOptions : ['numbers-random', 'numbers-pseudorandom', 'numbers-settlement'],
    sliderDiv : 'number-slider-resource-div',
    slider : 'number-slider-resource'
};

// Options for Number Slider - Settlement Distribution 
const numberSettlementOptions = {
    nonSliderOptions : ['numbers-random', 'numbers-pseudorandom', 'numbers-resource'],
    sliderDiv : 'number-slider-settlement-div',
    slider : 'number-slider-settlement'
};
//======================================================================================================================



//======================================================================================================================
function updateMobileMenu() {
    var mobileHeader = document.getElementById("mobile-header");
    var menu = document.getElementById("sidebar");
    var collapseButton = document.getElementById("collapse");
    var expandButton = document.getElementById("expand");
    var generateButton = document.getElementById("generate");
    if (window.getComputedStyle(mobileHeader).display === "none") {
        // Hide menu, show mobile header
        menu.style.display='none';
        mobileHeader.style.display='inline-block';
        expandButton.style.display='inline-block';
    } else {
        // Hide mobile header, show menu.
        mobileHeader.style.display='none';
        menu.style.display='block';
        expandButton.style.display="inline-block";
    }
} // updateMobileMenu ()
//======================================================================================================================



//======================================================================================================================
/**
 * Update (show/hide) a slider.
 * 
 * @param {*} options An object specifying the options and slider ids.
 */
function updateSlider(options) {
    var showSlider = true;
    // Check that slider option is/is not checked.
    for (var i = 0; i < options.nonSliderOptions.length; i++) {
        if (document.getElementById(options.nonSliderOptions[i]).checked)
            showSlider = false;
    }
    var sliderDiv = document.getElementById(options.sliderDiv);
    document.getElementById(options.slider).value = 50;
    // Show or hide the div containing the slider.
    sliderDiv.style.display = (showSlider ? "block" : "none");
} // updateSlider ()
//======================================================================================================================



//======================================================================================================================
/**
 * Update sliders.
 */
function updateResourcesSlider() { updateSlider(resourceOptions) }
function updateNumberResourcesSlider() { updateSlider(numberResourceOptions) }
function updateNumberSettlementSlider() { updateSlider(numberSettlementOptions) }
function updateNumberSliders() { 
    updateNumberResourcesSlider();
    updateNumberSettlementSlider();
} // updateNumberSliders ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get the value of a set of radio buttons.
 * 
 * @param {*} radioName The name of the set of radio buttons.
 * @returns The checked value of the set of radio buttons.
 */
function getRadioValue(radioName) {
    var radioElements = document.getElementsByName(radioName);
    for (var i = 0; i < radioElements.length; i++)
        if (radioElements[i].checked) return radioElements[i].value;
} // getRadioValue ()
//======================================================================================================================



//======================================================================================================================
/**
 * Get the value of a given submenu.
 * 
 * @param {*} name The name of the submenu.
 * @returns An object representing the submenu option.
 */
export function getSubmenuOption(subMenuName) {
    var submenuOption = { name : getRadioValue(subMenuName) };
    if (radioValueToSliderValue.hasOwnProperty(submenuOption.name)) {
        submenuOption.p = document.getElementById(radioValueToSliderValue[submenuOption.name]).value - 1
        submenuOption.p /= 100;
    }
    return submenuOption;
} // getSubmenuOption ()
//======================================================================================================================



//======================================================================================================================
// Make the module functions global for updating sliders.
window.updateResourcesSlider = updateResourcesSlider;
window.updateNumberSliders = updateNumberSliders;
window.updateMobileMenu = updateMobileMenu;
//======================================================================================================================