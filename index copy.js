const UIstepperForm = document.querySelector('.stepper-form');
const UIprevBtn = document.querySelector('.prev-btn');
const UInextBtn = document.querySelector('.next-btn');
const UIstepperSubmitBtn = document.querySelector('.stepper-submit-btn');
const UISteps = document.querySelectorAll('.step');

let currentStep = 0;
UInextBtn.addEventListener('click', handleNextClick);
UIprevBtn.addEventListener('click', handlePrevClick);

showStep();
createStepperIndicators();
selectCurrentStepIndicator();

for (let singleStep of UISteps) {
	handleSingleStep();
}

function handleSingleStep() {
	// select all current step inputs, textareas, and selectors
	const stepErrorsObj = {};
	const UIcurrentStep = document.querySelector('.active-step');
	const UIcurrentStepInputs = UIcurrentStep.querySelectorAll('input');
	const UIcurrentStepTextareas = UIcurrentStep.querySelectorAll(
		'.active-step textarea'
	);
	const UIcurrentStepSelectors = UIcurrentStep.querySelectorAll(
		'.active-step select'
	);

	// validate inputs on change
	validateInputFieldOnChange(UIcurrentStepInputs, stepErrorsObj);
	validateInputFieldOnChange(UIcurrentStepTextareas, stepErrorsObj);
	validateInputFieldOnChange(UIcurrentStepSelectors, stepErrorsObj);

	function handleNextClick(e) {
		e.preventDefault();
		////////////////////////////////////////////////////
		// validate inputs, selctors, textareas
		validateInputFieldOnNextClick(UIcurrentStepInputs, stepErrorsObj);
		validateInputFieldOnNextClick(UIcurrentStepTextareas, stepErrorsObj);
		validateInputFieldOnNextClick(UIcurrentStepSelectors, stepErrorsObj);
		////////////////////////////////////////////////////
		// do the following if and only if the current step is valid
		if (Object.keys(stepErrorsObj).length === 0) {
			// increment current step
			// show a step
			// select indicator
			currentStep += 1;
			currentStep === UISteps.length && (currentStep = UISteps.length - 1);
			showStep();
			selectCurrentStepIndicator();
		}
		// if there are step errros handle them
		// by looping over the erros object and append 'has-erro' class to its parent
		// and append the value of the error to the helper error span
		else {
			for (let key in stepErrorsObj) {
				const UIinputWithError = UIcurrentStep.querySelector(`[name=${key}]`);
				UIinputWithError.parentElement.classList.add('has-error');
				UIinputWithError.parentElement.querySelector(
					'.helper-error'
				).textContent = stepErrorsObj[key];
			}

			UIstepperSubmitBtn.setAttribute('disabled', true);
			UInextBtn.setAttribute('disabled', true);
		}
	}

	function handlePrevClick(e) {
		e.preventDefault();
		// decrement current step
		// show a step
		// select indicator
		currentStep -= 1;
		currentStep === 0 && (currentStep = 0);
		showStep();
		selectCurrentStepIndicator();
	}

	function showStep() {
		// hide the submit btn and only show it if iam in the last step
		// check if the current step is the first one the remove the prev btn
		currentStep === 0
			? (UIprevBtn.style.display = 'none')
			: (UIprevBtn.style.display = 'block');

		// check if the current step is the equal to steps lenght - 1 (last step) => then remove the next btn and show the submit btn
		if (currentStep === UISteps.length - 1) {
			UInextBtn.style.display = 'none';
			UIstepperSubmitBtn.style.display = 'block';
		} else {
			UInextBtn.style.display = 'block';
			UIstepperSubmitBtn.style.display = 'none';
		}

		// check if the current step is the same of the stepIndex => then add the active-step class
		for (let cs of UISteps) {
			cs.classList.remove('active-step');
			const stepIndex = parseInt(cs.dataset.stepIndex);
			if (currentStep === stepIndex) {
				cs.classList.add('active-step');
			}
		}
	}

	// create indicators
	function createStepperIndicators() {
		const indicators = document.createElement('div');
		indicators.classList.add('stepper-indicators');
		UIstepperForm.appendChild(indicators);
		for (let i = 0; i < UISteps.length; i++) {
			const indicator = document.createElement('div');
			indicator.classList.add('indicator');
			indicator.setAttribute('data-index', i);
			indicators.appendChild(indicator);
		}
	}

	// select the current step indicator
	function selectCurrentStepIndicator() {
		for (let i of document.querySelectorAll('.stepper-indicators .indicator')) {
			if (currentStep === parseInt(i.dataset.index))
				i.classList.add('active-indicator');
			else i.classList.remove('active-indicator');
		}
	}

	/////////////////////
	// validate input on next click
	function validateInputFieldOnNextClick(DOMcurrentStepInputs, errorsObj) {
		for (let input of DOMcurrentStepInputs) {
			if (!input.value) {
				errorsObj[input.name] = 'Rquired';
			} else {
				// delete the valid properity form the errors object
				// remove the has-error class from the parent of the input
				// and clear the helper-error span
				delete errorsObj[input.name];
				input.parentElement.classList.remove('has-error');
				input.parentElement.querySelector('.helper-error').textContent = '';
			}
		}
	}
	///////////////////////////
	// validate input on change
	function validateInputFieldOnChange(DOMcurrentStepInputs, errorsObj) {
		for (let input of DOMcurrentStepInputs) {
			input.addEventListener(
				'keyup',
				e => handleInputFieldChange(errorsObj, input, e),
				false
			);
			input.addEventListener(
				'change',
				e => handleInputFieldChange(errorsObj, input, e),
				false
			);
			input.addEventListener(
				'blur',
				e => handleInputFieldChange(errorsObj, input, e),
				false
			);
		}
	}

	function handleInputFieldChange(errorsObj, input, e) {
		// input.setAttribute('value', e.target.value);
		if (e.target.value && Object.keys(errorsObj).length > 0) {
			// delete the valid properity form the errors object
			// remove the has-error class from the parent of the input
			// and clear the helper-error span
			delete errorsObj[input.name];

			// input.parentElement.classList.remove('has-error');
			// input.parentElement.querySelector('.helper-error').textContent = '';
		}

		// if there are step errros handle them
		// add this input to the errors object
		// append 'has-erro' class to its parent
		// and append the value of the error to the helper error span
		// disable the next and submit buttons
		else if (!e.target.value && Object.keys(errorsObj.length > 0)) {
			errorsObj[input.name] = 'Required';
			// input.parentElement.classList.add('has-error');
			// input.parentElement.querySelector('.helper-error').textContent =
			// 	errorsObj[name];
		}

		if (Object.keys(errorsObj).length === 0) {
			UIstepperSubmitBtn.removeAttribute('disabled');
			UInextBtn.removeAttribute('disabled');

			input.parentElement.classList.remove('has-error');
			input.parentElement.querySelector('.helper-error').textContent = '';
		} else {
			UIstepperSubmitBtn.setAttribute('disabled', true);
			UInextBtn.setAttribute('disabled', true);
			input.parentElement.classList.add('has-error');
			input.parentElement.querySelector('.helper-error').textContent =
				errorsObj[input.name];
		}
		console.log(errorsObj);
	}
}

// function handleSingleStep() {
// 	// select all current step inputs, textareas, and selectors
// 	const stepErrorsObj = {};
// 	const UIcurrentStep = document.querySelector('.active-step');
// 	const UIcurrentStepInputs = UIcurrentStep.querySelectorAll('input');
// 	const UIcurrentStepTextareas = UIcurrentStep.querySelectorAll(
// 		'.active-step textarea'
// 	);
// 	const UIcurrentStepSelectors = UIcurrentStep.querySelectorAll(
// 		'.active-step select'
// 	);

// 	// validate inputs on change
// 	validateInputFieldOnChange(UIcurrentStepInputs, stepErrorsObj);
// 	validateInputFieldOnChange(UIcurrentStepTextareas, stepErrorsObj);
// 	validateInputFieldOnChange(UIcurrentStepSelectors, stepErrorsObj);

// 	function handleNextClick(e) {
// 		e.preventDefault();
// 		////////////////////////////////////////////////////
// 		// validate inputs, selctors, textareas
// 		validateInputFieldOnNextClick(UIcurrentStepInputs, stepErrorsObj);
// 		validateInputFieldOnNextClick(UIcurrentStepTextareas, stepErrorsObj);
// 		validateInputFieldOnNextClick(UIcurrentStepSelectors, stepErrorsObj);
// 		////////////////////////////////////////////////////
// 		// do the following if and only if the current step is valid
// 		if (Object.keys(stepErrorsObj).length === 0) {
// 			// increment current step
// 			// show a step
// 			// select indicator
// 			currentStep += 1;
// 			currentStep === UISteps.length && (currentStep = UISteps.length - 1);
// 			showStep();
// 			selectCurrentStepIndicator();
// 		}
// 		// if there are step errros handle them
// 		// by looping over the erros object and append 'has-erro' class to its parent
// 		// and append the value of the error to the helper error span
// 		else {
// 			for (let key in stepErrorsObj) {
// 				const UIinputWithError = UIcurrentStep.querySelector(`[name=${key}]`);
// 				UIinputWithError.parentElement.classList.add('has-error');
// 				UIinputWithError.parentElement.querySelector(
// 					'.helper-error'
// 				).textContent = stepErrorsObj[key];
// 			}

// 			UIstepperSubmitBtn.setAttribute('disabled', true);
// 			UInextBtn.setAttribute('disabled', true);
// 		}
// 	}

// 	function handlePrevClick(e) {
// 		e.preventDefault();
// 		// decrement current step
// 		// show a step
// 		// select indicator
// 		currentStep -= 1;
// 		currentStep === 0 && (currentStep = 0);
// 		showStep();
// 		selectCurrentStepIndicator();
// 	}

// 	function showStep() {
// 		// hide the submit btn and only show it if iam in the last step
// 		// check if the current step is the first one the remove the prev btn
// 		currentStep === 0
// 			? (UIprevBtn.style.display = 'none')
// 			: (UIprevBtn.style.display = 'block');

// 		// check if the current step is the equal to steps lenght - 1 (last step) => then remove the next btn and show the submit btn
// 		if (currentStep === UISteps.length - 1) {
// 			UInextBtn.style.display = 'none';
// 			UIstepperSubmitBtn.style.display = 'block';
// 		} else {
// 			UInextBtn.style.display = 'block';
// 			UIstepperSubmitBtn.style.display = 'none';
// 		}

// 		// check if the current step is the same of the stepIndex => then add the active-step class
// 		for (let cs of UISteps) {
// 			cs.classList.remove('active-step');
// 			const stepIndex = parseInt(cs.dataset.stepIndex);
// 			if (currentStep === stepIndex) {
// 				cs.classList.add('active-step');
// 			}
// 		}
// 	}

// 	// create indicators
// 	function createStepperIndicators() {
// 		const indicators = document.createElement('div');
// 		indicators.classList.add('stepper-indicators');
// 		UIstepperForm.appendChild(indicators);
// 		for (let i = 0; i < UISteps.length; i++) {
// 			const indicator = document.createElement('div');
// 			indicator.classList.add('indicator');
// 			indicator.setAttribute('data-index', i);
// 			indicators.appendChild(indicator);
// 		}
// 	}

// 	// select the current step indicator
// 	function selectCurrentStepIndicator() {
// 		for (let i of document.querySelectorAll('.stepper-indicators .indicator')) {
// 			if (currentStep === parseInt(i.dataset.index))
// 				i.classList.add('active-indicator');
// 			else i.classList.remove('active-indicator');
// 		}
// 	}

// 	/////////////////////
// 	// validate input on next click
// 	function validateInputFieldOnNextClick(DOMcurrentStepInputs, errorsObj) {
// 		for (let input of DOMcurrentStepInputs) {
// 			if (!input.value) {
// 				errorsObj[input.name] = 'Rquired';
// 			} else {
// 				// delete the valid properity form the errors object
// 				// remove the has-error class from the parent of the input
// 				// and clear the helper-error span
// 				delete errorsObj[input.name];
// 				input.parentElement.classList.remove('has-error');
// 				input.parentElement.querySelector('.helper-error').textContent = '';
// 			}
// 		}
// 	}
// 	///////////////////////////
// 	// validate input on change
// 	function validateInputFieldOnChange(DOMcurrentStepInputs, errorsObj) {
// 		for (let input of DOMcurrentStepInputs) {
// 			input.addEventListener(
// 				'keyup',
// 				e => handleInputFieldChange(errorsObj, input, e),
// 				false
// 			);
// 			input.addEventListener(
// 				'change',
// 				e => handleInputFieldChange(errorsObj, input, e),
// 				false
// 			);
// 			input.addEventListener(
// 				'blur',
// 				e => handleInputFieldChange(errorsObj, input, e),
// 				false
// 			);
// 		}
// 	}

// 	function handleInputFieldChange(errorsObj, input, e) {
// 		// input.setAttribute('value', e.target.value);
// 		if (e.target.value && Object.keys(errorsObj).length > 0) {
// 			// delete the valid properity form the errors object
// 			// remove the has-error class from the parent of the input
// 			// and clear the helper-error span
// 			delete errorsObj[input.name];

// 			// input.parentElement.classList.remove('has-error');
// 			// input.parentElement.querySelector('.helper-error').textContent = '';
// 		}

// 		// if there are step errros handle them
// 		// add this input to the errors object
// 		// append 'has-erro' class to its parent
// 		// and append the value of the error to the helper error span
// 		// disable the next and submit buttons
// 		else if (!e.target.value && Object.keys(errorsObj.length > 0)) {
// 			errorsObj[input.name] = 'Required';
// 			// input.parentElement.classList.add('has-error');
// 			// input.parentElement.querySelector('.helper-error').textContent =
// 			// 	errorsObj[name];
// 		}

// 		if (Object.keys(errorsObj).length === 0) {
// 			UIstepperSubmitBtn.removeAttribute('disabled');
// 			UInextBtn.removeAttribute('disabled');

// 			input.parentElement.classList.remove('has-error');
// 			input.parentElement.querySelector('.helper-error').textContent = '';
// 		} else {
// 			UIstepperSubmitBtn.setAttribute('disabled', true);
// 			UInextBtn.setAttribute('disabled', true);
// 			input.parentElement.classList.add('has-error');
// 			input.parentElement.querySelector('.helper-error').textContent =
// 				errorsObj[input.name];
// 		}
// 		console.log(errorsObj);
// 	}
// }
