// handle stepper form
if (document.querySelector('.stepper-form')) {
	const UIstepperForm = document.querySelector('.stepper-form');
	const UIprevBtn = document.querySelector('.prev-btn');
	const UInextBtn = document.querySelector('.next-btn');
	const UIstepperSubmitBtn = document.querySelector('.stepper-submit-btn');
	const UIformSteps = document.querySelectorAll('.step');

	let currentStep = 0;
	UInextBtn.addEventListener('click', handleNextClick);
	UIprevBtn.addEventListener('click', handlePrevClick);

	showStep();
	createStepperIndicators();
	selectCurrentStepIndicator();

	// select all current step inputs, textareas, and selectors
	const stepErrorsObj = {};
	let UIcurrentStep = document.querySelector('.active-step');
	let UIcurrentStepInputs = UIcurrentStep.querySelectorAll(
		'.active-step input'
	);
	let UIcurrentStepTextareas = UIcurrentStep.querySelectorAll(
		'.active-step textarea'
	);
	let UIcurrentStepSelectors = UIcurrentStep.querySelectorAll(
		'.active-step select'
	);

	const UIStepperInputs = document.querySelectorAll('.stepper-form input');
	const UIStepperTextareas = document.querySelectorAll(
		'.stepper-form textarea'
	);
	const UIStepperSelectors = document.querySelectorAll('.stepper-form select');
	// validate inputs on change for each form step
	validateInputFieldOnChange(UIStepperInputs, stepErrorsObj);
	validateInputFieldOnChange(UIStepperTextareas, stepErrorsObj);
	validateInputFieldOnChange(UIStepperSelectors, stepErrorsObj);

	function handleNextClick(e) {
		e.preventDefault();
		////////////////////////////////////////////////////
		// validate inputs, selctors, textareas
		validateInputFieldOnNextClick(UIcurrentStepInputs, stepErrorsObj);
		validateInputFieldOnNextClick(UIcurrentStepTextareas, stepErrorsObj);
		validateInputFieldOnNextClick(UIcurrentStepSelectors, stepErrorsObj);

		////////////////////////////////////////////////////
		// do the following if and only if the current step is valid
		if (
			Object.keys(stepErrorsObj).length === 0 &&
			currentStep < UIformSteps.length - 1
		) {
			// increment current step
			// update the currentStep document selector
			// show a step
			// select indicator
			currentStep += 1;
			UIcurrentStep = document.querySelector(
				`.step[data-step-index="${currentStep}"]`
			);
			UIcurrentStepInputs = UIcurrentStep.querySelectorAll('input');
			UIcurrentStepTextareas = UIcurrentStep.querySelectorAll('textarea');
			UIcurrentStepSelectors = UIcurrentStep.querySelectorAll('select');

			currentStep === UIformSteps.length &&
				(currentStep = UIformSteps.length - 1);
			showStep();
			selectCurrentStepIndicator();
		}
		console.log('after click', stepErrorsObj);
	}

	function handlePrevClick(e) {
		e.preventDefault();
		// delete all the errors object attributes
		// remove the disabled from submit and next btns
		// remove has-error from every input
		// decrement current step
		// update the current step document element
		// show a step
		// select indicator

		for (let key in stepErrorsObj) {
			delete stepErrorsObj[key];
		}
		if (UIcurrentStep.querySelector('.has-error')) {
			for (let i of UIcurrentStep.querySelectorAll('.has-error')) {
				i.classList.remove('has-error');
				i.querySelector('.helper-error').textContent = '';
			}
		}

		currentStep -= 1;
		UIcurrentStep = document.querySelector(
			`.step[data-step-index="${currentStep}"]`
		);
		UIcurrentStepInputs = UIcurrentStep.querySelectorAll('input');
		UIcurrentStepTextareas = UIcurrentStep.querySelectorAll('textarea');
		UIcurrentStepSelectors = UIcurrentStep.querySelectorAll('select');

		currentStep === 0 && (currentStep = 0);
		showStep();
		// UIstepperSubmitBtn.removeAttribute('disabled');
		UInextBtn.removeAttribute('disabled');
		selectCurrentStepIndicator();
	}

	function showStep() {
		// hide the submit btn and only show it if iam in the last step
		// check if the current step is the first one the remove the prev btn
		currentStep === 0
			? (UIprevBtn.style.display = 'none')
			: (UIprevBtn.style.display = 'block');

		// check if the current step is the equal to steps lenght - 1 (last step) => then remove the next btn and show the submit btn
		if (currentStep === UIformSteps.length - 1) {
			UInextBtn.style.display = 'none';
			UIstepperSubmitBtn.style.display = 'block';
		} else {
			UInextBtn.style.display = 'block';
			UIstepperSubmitBtn.style.display = 'none';
		}

		// check if the current step is the same of the stepIndex => then add the active-step class
		for (let cs of UIformSteps) {
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
		UIstepperForm.querySelector('.btns__indicators').insertBefore(
			indicators,
			UIstepperForm.querySelector('.btns')
		);
		for (let i = 0; i < UIformSteps.length; i++) {
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
			if (input.type === 'checkbox') {
				if (!input.checked) {
					errorsObj[input.name] = 'Required';
					input.parentElement.classList.add('has-error');
					input.parentElement.querySelector('.helper-error').textContent =
						stepErrorsObj[input.name];
					UInextBtn.setAttribute('disabled', true);
				} else {
					delete errorsObj[input.name];
					input.parentElement.classList.remove('has-error');
					input.parentElement.querySelector('.helper-error').textContent = '';
				}
			} else if (input.type === 'radio') {
				let UIfieldRadios = input.parentElement.querySelectorAll(
					'input[type="radio"]'
				);
				let radiosHaveNoError = false;
				// false || false || false => false
				// false || true || false => true
				for (let i of UIfieldRadios) {
					radiosHaveNoError = radiosHaveNoError || i.checked;
				}
				// if no one of the radios checked
				if (!radiosHaveNoError) {
					errorsObj[UIfieldRadios[0].name] = 'Required';
					UIfieldRadios[0].parentElement.classList.add('has-error');
					UIfieldRadios[0].parentElement.querySelector(
						'.helper-error'
					).textContent = stepErrorsObj[UIfieldRadios[0].name];
					UInextBtn.setAttribute('disabled', true);
				} else {
					delete errorsObj[UIfieldRadios[0].name];
					UIfieldRadios[0].parentElement.classList.remove('has-error');
					UIfieldRadios[0].parentElement.querySelector(
						'.helper-error'
					).textContent = '';
				}
			} else {
				if (!input.value) {
					errorsObj[input.name] = 'Required';
					input.parentElement.classList.add('has-error');
					input.parentElement.querySelector('.helper-error').textContent =
						stepErrorsObj[input.name];
					UInextBtn.setAttribute('disabled', true);
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
	}
	///////////////////////////
	// validate input on change
	function validateInputFieldOnChange(DOMstepperInputs, errorsObj) {
		for (let input of DOMstepperInputs) {
			input.addEventListener(
				'input',
				e => handleInputFieldChange(errorsObj, input, e),
				false
			);
			input.addEventListener(
				'blur',
				e => handleInputFieldChange(errorsObj, input, e),
				false
			);
			if (input.type === 'checkbox' || input.type === 'radio') {
				input.addEventListener(
					'click',
					e => handleInputFieldChange(errorsObj, input, e),
					false
				);
			}
		}
	}

	function handleInputFieldChange(errorsObj, input, e) {
		// input.setAttribute('value', e.target.value);
		if (input.type === 'checkbox' || input.type === 'radio') {
			if (e.target.checked && Object.keys(errorsObj).length > 0) {
				delete errorsObj[input.name];
				input.parentElement.classList.remove('has-error');
				input.parentElement.querySelector('.helper-error').textContent = '';
			} else if (!e.target.checked && Object.keys(errorsObj.length > 0)) {
				console.log('abc');
				UInextBtn.setAttribute('disabled', true);
				errorsObj[input.name] = 'Required';
				input.parentElement.classList.add('has-error');
				input.parentElement.querySelector('.helper-error').textContent =
					errorsObj[input.name];
			} else if (e.target.checked && Object.keys(errorsObj.length === 0)) {
				UInextBtn.removeAttribute('disabled');
			}
		}
		// check if any other input of type text, number, date, file ......
		else {
			if (e.target.value && Object.keys(errorsObj).length > 0) {
				// delete the valid properity form the errors object
				// remove the has-error class from the parent of the input
				// and clear the helper-error span
				delete errorsObj[input.name];
				input.parentElement.classList.remove('has-error');
				input.parentElement.querySelector('.helper-error').textContent = '';
			}

			// if there are step errros handle them
			// add this input to the errors object
			// append 'has-erro' class to its parent
			// and append the value of the error to the helper error span
			// disable the next and submit buttons
			else if (!e.target.value && Object.keys(errorsObj.length > 0)) {
				console.log('abc');
				UInextBtn.setAttribute('disabled', true);
				errorsObj[input.name] = 'Required';
				input.parentElement.classList.add('has-error');
				input.parentElement.querySelector('.helper-error').textContent =
					errorsObj[input.name];
			} else if (e.target.value && Object.keys(errorsObj.length === 0)) {
				UInextBtn.removeAttribute('disabled');
			}
		}

		console.log(errorsObj);
	}

	UIstepperForm.addEventListener('submit', e => {
		// e.preventDefault();
		console.log('hi');
		handleNextClick(e);
	});
}
