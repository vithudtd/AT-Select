let atSelect = {
    ATS_elementClass : 'searchable-dropdown',
    ATS_elementMultiselectClass : 'multiple',
    ATS_elementHeight : '38px',
    ATS_elementBorder : '1px solid #ced4da',
    ATS_elementBorderRedius : '0.25rem',
    ATS_elementBackgroundColor : '#fff',
    ATS_addNewButtonPosition : 'top',
    ATS_isFirstSearch : false,
    ATS_PAGE : 1,
    ATS_DATA_IS_FULL : false,
    ATS_isMouseOver : false,

    initialize : function (props = {}) {
        atSelect.ATS_elementClass = props.dropdownClass || atSelect.ATS_elementClass;
        atSelect.ATS_elementHeight = props.dropdownHeight || atSelect.ATS_elementHeight;
        atSelect.ATS_elementBorder = props.dropdownBorder || atSelect.ATS_elementBorder;
        atSelect.ATS_elementBorderRedius = props.dropdownBorderRedius || atSelect.ATS_elementBorderRedius;
        atSelect.ATS_elementBackgroundColor = props.dropdownBackgroundColor || atSelect.ATS_elementBackgroundColor;
        atSelect.ATS_addNewButtonPosition = props.addNewButtonPosition || atSelect.ATS_addNewButtonPosition;
        document.addEventListener("DOMContentLoaded", function() {
            document.body.addEventListener("click", function(event) {
                var hasClass = this.classList.contains("at-select-visible");
                var atSelectContainerOpen = document.querySelector(".at-select-container--open");
                if (atSelectContainerOpen && !event.target.classList.contains('at-select-selection') && !event.target.closest('.at-select-dropdown') && !event.target.closest('.choice') && !event.target.closest('.choice-remove') && !event.target.closest('.at-select-selection-label') && !event.target.closest('.at-select-selection-icon')  && !event.target.closest('.at-select-selection-icon-remove') && hasClass) {
                    atSelectContainerOpen.remove();

                    this.classList.remove("at-select-visible");

                    var elements = document.querySelectorAll(".at-select-container .at-select-selection");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].classList.remove("show");
                    }
                }
            });
        });
        atSelect.containerInitialize();
    },

    containerInitialize : function (element='',id='') {
        var already_open = document.querySelector(".at-select-container--open");
        if (already_open) {
            already_open.remove();
        }
        var already_open = document.body.classList;
        if (already_open) {
            already_open.remove("at-select-visible");
        }
        var already_in = document.querySelectorAll(".at-select-container .at-select-selection");
        for (var i = 0; i < already_in.length; i++) {
            already_in[i].classList.remove("show");
        }

        if (element != '') {
            var atSelectContainer = document.querySelector(`[data-at-container-id='${id}']`);
            if (atSelectContainer) {
                atSelectContainer.remove();
            }
            var allin = element.parentNode.querySelector('.at-select-container');
            if (allin) {
                allin.remove();
            }
            if (id == '') {
                index = "at-"+atSelect.generateRandomString(6)+"-"+atSelect.generateRandomString(4);
            }
            else {
                index = id;
            }
            atSelect.initializeElement(element,index);
        } else {
            let oldElements = document.getElementsByClassName('at-select-container');
            while(oldElements.length > 0) {
                oldElements[0].parentNode.removeChild(oldElements[0]);
            }

            var elements = document.getElementsByClassName(atSelect.ATS_elementClass);
            for (var i = 0; i < elements.length; i++) {
                let randomIndex = "at-"+i+"-"+atSelect.generateRandomString(4);
                var element = elements[i];
                atSelect.initializeElement(element,randomIndex);
            }
        }

        // Get the element(s)
        var elements = document.querySelectorAll(".at-select-container .at-select-selection");

        for (var i = 0; i < elements.length; i++) {
            elements[i].removeEventListener("click", atSelect.containerSelectionClick);
            elements[i].addEventListener("click", atSelect.containerSelectionClick);
        }

        var assir = document.querySelectorAll(".at-select-container .at-select-selection-icon-remove");
        for (var i = 0; i < assir.length; i++) {
            assir[i].removeEventListener("click", atSelect.containerClearClick);
            assir[i].addEventListener("click", atSelect.containerClearClick);
        }
    },

    initializeElement : function (element,randomIndex) {
        const multiple = element.getAttribute('multiple');
        element.classList.add("at-select-hidden-cont");
        if (multiple != null && multiple != undefined) {
            element.classList.add("multiple");
        }
        element.setAttribute("data-at-id", randomIndex);

        // at-select-container
        var newElement = document.createElement("span");
        newElement.classList.add("at-select", "at-select-container");
        newElement.setAttribute("data-at-container-id", randomIndex);

        element.insertAdjacentElement("afterend", newElement);

        var is_multiple = element.classList.contains(atSelect.ATS_elementMultiselectClass);
        var data_api = element.getAttribute('data-ats-get-api') || '';
        var data_func = element.getAttribute('data-ats-get-func') || '';
        var data_placeholder = element.getAttribute('data-ats-placeholder');
        var elementIsDisabled = element.getAttribute('disabled'); //at-select-selection-disabled
        var elementIsReadonly = element.getAttribute('readonly'); //at-select-selection-disabled

        if ((data_api != '' && data_api != null && data_api != undefined) || (data_func != '' && data_func != null && data_func != undefined)) {
            var is_detected = false;
            for (let id = element.options.length - 1; id >= 0; id--) {
                var init_obj = {
                    value: element.options[id].value,
                    text: element.options[id].innerText
                }
                if (is_multiple) {
                    if (!element.options[id].selected) {
                        element.remove(id);
                    }
                    else {
                        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(init_obj), 'APPTIMUS_L4QY2WETMO');
                        element.options[id].setAttribute('data-at-obj', encrypted);
                        is_detected = true;
                    }
                } else {
                    if (!element.options[id].selected || is_detected) {
                        element.remove(id);
                    }
                    else {
                        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(init_obj), 'APPTIMUS_L4QY2WETMO');
                        element.options[id].setAttribute('data-at-obj', encrypted);
                        is_detected = true;
                    }
                }
            }
        }

        // at-select-selection
        if (is_multiple) {
            // at-select-selection--multiple
            var newElement2 = document.createElement("span");
            newElement2.classList.add("at-select-selection", "at-select-selection--multiple");

            choiceLength = 0;
            for (let io = 0; io < element.options.length; io++) {
                if (element.options[io].selected) {
                    choiceLength++;
                    var newElement2_1 = document.createElement("span");
                    newElement2_1.classList.add("choice");
                    newElement2_1.setAttribute("data-value", element.options[io].value);
                    newElement2_1.innerHTML = element.options[io].innerHTML;

                    var newElement2_1_1 = document.createElement("span");
                    newElement2_1_1.classList.add("choice-remove");
                    newElement2_1.appendChild(newElement2_1_1);

                    var newElement2_1_1_1 = document.createElement("span");
                    newElement2_1_1_1.setAttribute("aria-hidden", true);
                    newElement2_1_1_1.innerHTML = '×';
                    newElement2_1_1.appendChild(newElement2_1_1_1);

                    newElement2.appendChild(newElement2_1);

                    newElement2_1_1.removeEventListener("click", atSelect.multipleSelectChoiceRemove);
                    newElement2_1_1.addEventListener("click", atSelect.multipleSelectChoiceRemove);
                }
            }

            // if (choiceLength == 0 && data_placeholder != null && data_placeholder != '' && data_placeholder != undefined) {
            //     var label_m = document.createElement("span");
            //     label_m.style.marginLeft = '12px';
            //     label_m.innerHTML = data_placeholder;
            //     newElement2.appendChild(label_m);
            // }
        } else {
            // at-select-selection--single
            var newElement2 = document.createElement("span");
            newElement2.classList.add("at-select-selection", "at-select-selection--single");

            // label
            var selectedOption = element.options[element.selectedIndex];
            var newElement3 = document.createElement("span");
            newElement3.classList.add("at-select-selection-label");

            if (selectedOption) {
                if (selectedOption.innerHTML == '') {
                    newElement3.innerHTML = 'Select an option';
                    newElement3.classList.add('placeholder');
                }
                else {
                    newElement3.innerHTML = selectedOption.innerHTML;
                }
            }
            else if (data_placeholder != null && data_placeholder != '' && data_placeholder != undefined && selectedOption && selectedOption.value == '') {
                newElement3.innerHTML = data_placeholder;
                newElement3.classList.add('placeholder');
            }
            else {
                newElement3.innerHTML = 'Select an option';
                newElement3.classList.add('placeholder');
            }

            newElement2.appendChild(newElement3);
            var newElementDum = document.createElement("span");
            // remove icon
            var newElement4 = document.createElement("span");
            newElement4.classList.add("at-select-selection-icon-remove");
            newElement4.style.display = 'none';
            if (selectedOption && selectedOption.value != '') {
                newElement4.style.display = '';
            }
            newElement4.innerHTML = "×";
            newElementDum.appendChild(newElement4);
            // drop icon
            var newElement5 = document.createElement("span");
            newElement5.classList.add("at-select-selection-icon");
            newElement5.innerHTML = "&#9662;";

            newElementDum.appendChild(newElement5);
            newElement2.appendChild(newElementDum);
        }
        newElement2.style.height = atSelect.ATS_elementHeight;
        newElement2.style.backgroundColor = atSelect.ATS_elementBackgroundColor;
        newElement2.style.border = atSelect.ATS_elementBorder;
        newElement2.style.borderRadius = atSelect.ATS_elementBorderRedius;

        newElement.appendChild(newElement2);
        if ((elementIsDisabled != null && elementIsDisabled != undefined) || (elementIsReadonly != null && elementIsReadonly != undefined)) {
            var disabledElement = document.createElement("span");
            disabledElement.classList.add('at-select-selection-disabled');
            newElement.appendChild(disabledElement);
        }
    },

    containerClearClick : function (e) {
        setTimeout(() => {
            let container = this.closest('.at-select-container');
            let id = container.getAttribute('data-at-container-id');
            var activeElement = document.querySelector(`[data-at-id='${id}']`);

            if (activeElement) {
                var container_active_options = document.querySelectorAll(".at-select-results .at-select-results__options .at-select-results__option.selected");
                for (let ccio = 0; ccio < container_active_options.length; ccio++) {
                    let container_choice_element = container_active_options[ccio];
                    let c_value = container_choice_element.getAttribute('data-option-value');
                    if (c_value == activeElement.value) {
                        container_choice_element.classList.remove('selected');
                        break;
                    }
                }
            }

            empty_option = false;
            for (let io = 0; io < activeElement.options.length; io++) {
                option = activeElement.options[io];
                if (option.value == '') {
                    empty_option = true;
                }
                option.removeAttribute('selected');
            }

            if (!empty_option) {
                var newOption = document.createElement("option");
                newOption.setAttribute("value", '');
                activeElement.appendChild(newOption);
            }
            activeElement.value = '';

            var label = container.querySelector('.at-select-selection-label');
            var activeElementAfterClear = document.querySelector(`[data-at-id='${id}']`);
            var data_api = activeElementAfterClear.getAttribute('data-ats-get-api') || '';
            var data_func = activeElementAfterClear.getAttribute('data-ats-get-func') || '';
            var data_placeholder = activeElementAfterClear.getAttribute('data-ats-placeholder');
            var selectedOption = activeElementAfterClear.options[activeElementAfterClear.selectedIndex];
            if (selectedOption) {
                if (selectedOption.innerHTML == '') {
                    label.innerHTML = 'Select an option';
                    label.classList.add('placeholder');
                }
                else {
                    label.innerHTML = selectedOption.innerHTML;
                }
            }

            if ((data_api != '' && data_api != null && data_api != undefined) || (data_func != '' && data_func != null && data_func != undefined)) {
                if (data_placeholder != null && data_placeholder != '' && data_placeholder != undefined) {
                    label.innerHTML = data_placeholder;
                    label.classList.add('placeholder');
                }
                else {
                    label.innerHTML = 'Select an option';
                    label.classList.add('placeholder');
                }
            }
            else if (data_placeholder != null && data_placeholder != '' && data_placeholder != undefined && selectedOption && selectedOption.value == '') {
                label.innerHTML = data_placeholder;
                label.classList.add('placeholder');
            }

            this.style.display = 'none';
            atSelect.onSelectTrigger(activeElementAfterClear);
        }, 0);
    },

    containerSelectionClick : function (e) {
        if ((!e.target.closest('.at-select-selection-icon-remove') || (e.target.closest('.at-select-selection-icon-remove') && !this.classList.contains("show"))) && (!e.target.closest('.choice-remove') || (e.target.closest('.choice-remove') && !this.classList.contains("show")))) {
            document.body.classList.remove("at-select-visible");
            document.body.style.position = "";
            var old_elements = document.querySelectorAll(".at-select-container .at-select-selection");
            for (var i2 = 0; i2 < old_elements.length; i2++) {
                if (this != old_elements[i2]) {
                    old_elements[i2].classList.remove("show");
                }
            }

            var hasClass = this.classList.contains("show");
            if (hasClass) {
                var atSelectContainerOpen = document.querySelector(".at-select-container--open");
                atSelectContainerOpen.remove();

                this.classList.remove("show");
                document.body.classList.remove("at-select-visible");
            } else {
                atSelect.containerShow(this);

                this.classList.add("show");
                document.body.classList.add("at-select-visible");

                atSelect.ATS_isFirstSearch = false;
                atSelect.ATS_PAGE = 1;
                atSelect.ATS_DATA_IS_FULL = false;
            }
        }
    },

    multipleSelectChoiceRemove : function (e) {
        id = this.closest('.at-select-container').getAttribute('data-at-container-id');
        var activeElement = document.querySelector(`[data-at-id='${id}']`);
        let active_options = activeElement.options;

        for (let cio = 0; cio < active_options.length; cio++) {
            if (active_options[cio].selected) {
                if (this.closest('.choice').getAttribute('data-value') == active_options[cio].value) {
                    active_options[cio].removeAttribute('selected');
                }
            }
        }

        var container_choice_active_options = document.querySelectorAll(".at-select-results .at-select-results__options .at-select-results__option.selected");
        for (let ccio = 0; ccio < container_choice_active_options.length; ccio++) {
            const container_choice_active_element = container_choice_active_options[ccio];
            let c_value = container_choice_active_element.getAttribute('data-option-value');
            if (c_value == this.closest('.choice').getAttribute('data-value')) {
                container_choice_active_element.classList.remove('selected');
            }
        }
        this.closest('.choice').remove();
        atSelect.onSelectTrigger(activeElement);
    },

    containerShow : function (that) {
        var atSelectContainerOpen = document.querySelector(".at-select-container--open");
        if (atSelectContainerOpen) {
            atSelectContainerOpen.remove();
        }

        var at_select_id = that.parentNode.getAttribute('data-at-container-id');
        var active_element = document.querySelector(`[data-at-id='${at_select_id}']`);
        let options = active_element.options;

        // at select attributes
        ats_is_multiple = active_element.classList.contains(atSelect.ATS_elementMultiselectClass);
        ats_is_searchable = active_element.hasAttribute('data-ats-get-api') || active_element.hasAttribute('data-ats-get-func');
        ats_data_api = active_element.getAttribute('data-ats-get-api') || '';
        ats_data_func = active_element.getAttribute('data-ats-get-func') || '';
        ats_data_add = active_element.getAttribute('data-ats-add') || '';
        ats_data_add_api = active_element.getAttribute('data-ats-add-api') || '';
        ats_data_add_func = active_element.getAttribute('data-ats-add-func') || '';
        // end at select attributes

        const rect = that.parentNode.getBoundingClientRect();
        const offset = {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
        let top = offset.top;
        let left = offset.left;
        let width = that.parentNode.offsetWidth;

        var container = document.createElement("span");
        container.setAttribute('data-at-selected-container-id',at_select_id);
        container.className = "at-select-container--open";
        container.style.position = "absolute";
        // container.style.top = `${top+parseFloat(atSelect.ATS_elementHeight)}px`;
        // container.style.left = `${left}px`;

        var dropdown = document.createElement("span");
        dropdown.className = "at-select-dropdown at-select-dropdown--below";
        dropdown.dir = "ltr";
        dropdown.style.width = `${width}px`;

        var search = document.createElement("span");
        search.className = "at-select-search at-select-search--dropdown";

        var input = document.createElement("input");
        input.className = "at-select-search__field";
        input.setAttribute("data-multiple", ats_is_multiple);
        input.setAttribute("data-ats-get-api", ats_data_api);
        input.setAttribute("data-ats-get-func", ats_data_func);
        input.type = "search";
        input.tabIndex = 0;
        input.autocorrect = "off";
        input.autocapitalize = "none";
        input.spellcheck = false;
        input.role = "searchbox";
        input.setAttribute("aria-autocomplete", "list");
        input.autocomplete = "off";
        input.setAttribute("aria-label", "Search");

        search.appendChild(input);
        dropdown.appendChild(search);

        var results = document.createElement("span");
        results.className = "at-select-results";

        var addNewoption = document.createElement("span");
        addNewoption.classList.add('at-select-results__options-add-new');
        addNewoption.classList.add(atSelect.ATS_addNewButtonPosition);
        addNewoption.setAttribute("data-ats-add", ats_data_add);
        addNewoption.setAttribute("data-ats-add-api", ats_data_add_api);
        addNewoption.setAttribute("data-ats-add-func", ats_data_add_func);
        addNewoption.setAttribute("data-ats-id", at_select_id);
        addNewoption.innerHTML = 'Add new';

        if (((ats_data_add != '' && ats_data_add != null && ats_data_add != undefined) || (ats_data_add_api != '' && ats_data_add_api != null && ats_data_add_api != undefined) || (ats_data_add_func != '' && ats_data_add_func != null && ats_data_add_func != undefined)) && atSelect.ATS_addNewButtonPosition == 'top') {
            results.appendChild(addNewoption);
        }

        var optionsList = document.createElement("ul");
        optionsList.className = "at-select-results__options";
        optionsList.setAttribute("role", "listbox");
        optionsList.setAttribute("aria-expanded", "true");
        optionsList.setAttribute("aria-hidden", "false");

        if (!ats_is_searchable) {
            for (let i = 0; i < options.length; i++) {
                let option = options[i];
                let is_selected = option.hasAttribute('selected');
                let is_disabled = option.hasAttribute('disabled');
                let is_hidden = option.hasAttribute('hidden');

                if (!is_hidden && option.value != '') {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'at-select-results__option ' + (is_disabled ? 'disabled' : 'selectable') + ' ' + (is_selected || active_element.value == option.value ? 'selected' : ''));
                    li.setAttribute('data-option-value', option.value);
                    li.setAttribute('data-option-id', at_select_id);
                    li.innerHTML = option.innerHTML;

                    optionsList.appendChild(li);
                }
            }
        }

        results.appendChild(optionsList);
        if (((ats_data_add != '' && ats_data_add != null && ats_data_add != undefined) || (ats_data_add_api != '' && ats_data_add_api != null && ats_data_add_api != undefined) || (ats_data_add_func != '' && ats_data_add_func != null && ats_data_add_func != undefined)) && atSelect.ATS_addNewButtonPosition == 'bottom') {
            results.appendChild(addNewoption);
        }
        dropdown.appendChild(results);
        container.appendChild(dropdown);
        // document.body.appendChild(container); // it's not working on the modal
        that.parentNode.appendChild(container);

        setTimeout(() => {
            let liFirst = document.querySelectorAll(".at-select-results .at-select-results__options .at-select-results__option")[0];
            if (liFirst) {
                liFirst.classList.add('highlight');
            }
            const searchField = document.querySelector('.at-select-dropdown .at-select-search__field');
            if (searchField) {
                searchField.select();
            }
        }, 0);

        atSelect.optionsInitialize();

        const addNewBtn = document.querySelector('.at-select-results__options-add-new');
        if (addNewBtn) {
            addNewBtn.removeEventListener("click", atSelect.addNewBtnHandleClick);
            addNewBtn.addEventListener("click", atSelect.addNewBtnHandleClick);
        }

        const atSelectSearchInput = document.querySelector(".at-select-search__field");
        atSelectSearchInput.addEventListener("keydown", function(e) {
            setTimeout(() => {
                atSelect.search(this, e, that, 'html');
            }, 0);
        });

        if (ats_is_searchable) {
            const keydownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                keyCode: 65
            });
            if (atSelectSearchInput) {
                atSelectSearchInput.dispatchEvent(keydownEvent);
            }
        }
    },

    addNewBtnHandleClick : function (e) {
        const ats_data_add = this.getAttribute('data-ats-add') || '';
        const ats_data_add_api = this.getAttribute('data-ats-add-api') || '';
        const ats_data_add_func = this.getAttribute('data-ats-add-func') || '';
        const ats_id = this.getAttribute('data-ats-id') || '';
        const sStr = this.querySelector('.at-select-results__options-add-new__cont');
        if (sStr) {
            searchStr = sStr.innerText;
        } else {
            searchStr = '';
        }

        if (ats_data_add != '' && ats_data_add != null && ats_data_add != undefined && searchStr) {
            atSelect.setOption(ats_id,{id:searchStr,text:searchStr});
        }
        else if (ats_data_add_func != '' && ats_data_add_func != null && ats_data_add_func != undefined) {
            let str = `${ats_data_add_func}('${ats_id}','${searchStr}')`;
            var addFunc=new Function(eval("(" + str + ")"));
            addFunc();
        }
        else if (ats_data_add_api != '' && ats_data_add_api != null && ats_data_add_api != undefined && searchStr != '') {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", ats_data_add_api+(ats_data_add_api.includes("?") ? "&" : "?" )+"search_str="+searchStr, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response?.data) {
                        atSelect.setOption(ats_id,response?.data);
                    }
                }
            };
            xhr.send();
        }
    },

    setOption : function (ats_id,obj) {
        var activeElement = document.querySelector(`[data-at-id='${ats_id}']`);
        if (activeElement) {
            const is_multiple = activeElement.classList.contains(atSelect.ATS_elementMultiselectClass);
            const has_api = activeElement.getAttribute('data-at-get-api') || '';

            if (!is_multiple) {
                for (let io = 0; io < activeElement.options.length; io++) {
                    option = activeElement.options[io];
                    option.removeAttribute('selected');
                }
            }

            var newOption = document.createElement("option");
            newOption.setAttribute("value", obj.id || obj.value);
            newOption.setAttribute("selected", true);

            if (has_api != '' && has_api != null && has_api != undefined) {
                var encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), 'APPTIMUS_L4QY2WETMO');
                newOption.setAttribute("data-at-obj", encrypted);
            }

            newOption.innerHTML = obj.name || obj.title || obj.description || obj.text;
            activeElement.appendChild(newOption);

            atSelect.containerInitialize(activeElement,ats_id);
            atSelect.onSelectTrigger(activeElement);
        }
    },

    setData : function (ats_id,data) {
        var activeContainer = document.querySelector(`[data-at-container-id='${ats_id}']`);
        var selecttion = activeContainer.querySelector('.at-select-selection');
        atSelect.printList(data,selecttion);
    },

    optionHandleClick : function (e) {
        if (this.classList.contains("selectable")) {
            var id = this.getAttribute('data-option-id');
            var value = this.getAttribute('data-option-value');
            var html = this.innerHTML;
            var activeElement = document.querySelector(`[data-at-id='${id}']`);
            var active_options = activeElement.options;


            var activeAtSelectElement = document.querySelector(`[data-at-container-id='${id}']`);
            let active_element_is_multiple = activeElement.classList.contains(atSelect.ATS_elementMultiselectClass);

            if (active_element_is_multiple) {
                var op_have = false;
                for (let io = 0; io < active_options.length; io++) {
                    if (value == active_options[io].value) {
                        op_have = true;
                    }
                }
                if (!op_have) {
                    var newOption = document.createElement("option");
                    newOption.setAttribute("value", value);
                    var o_data = this.getAttribute('data-option-obj') || '';
                    if (o_data != null && o_data != '' && o_data != undefined) {
                        newOption.setAttribute("data-at-obj", o_data);
                    }
                    newOption.innerHTML = html;
                    activeElement.appendChild(newOption);
                }
                var active_options = activeElement.options;
                for (let io = 0; io < active_options.length; io++) {
                    if (active_options[io].selected) {
                        if (value == active_options[io].value) {
                            active_options[io].removeAttribute('selected');
                            const childs = activeAtSelectElement.querySelectorAll(".at-select-selection .choice");
                            for (let ci = 0; ci < childs.length; ci++) {
                                if (childs[ci].getAttribute('data-value') == value) {
                                    childs[ci].remove();
                                }
                            }
                        }
                    }
                    else if (value == active_options[io].value) {
                        active_options[io].setAttribute('selected',true);
                        var newElement2_1 = document.createElement("span");
                        newElement2_1.classList.add("choice");
                        newElement2_1.setAttribute("data-value", value);
                        newElement2_1.innerHTML = html;

                        var newElement2_1_1 = document.createElement("span");
                        newElement2_1_1.classList.add("choice-remove");
                        newElement2_1.appendChild(newElement2_1_1);

                        var newElement2_1_1_1 = document.createElement("span");
                        newElement2_1_1_1.setAttribute("aria-hidden", true);
                        newElement2_1_1_1.innerHTML = '×';
                        newElement2_1_1.appendChild(newElement2_1_1_1);

                        activeAtSelectElement.children[0].appendChild(newElement2_1);

                        newElement2_1_1.addEventListener("click", atSelect.multipleSelectChoiceRemove);
                    }
                }

                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                }
                else {
                    this.classList.add("selected");
                }
            } else {
                var op_have = false;
                for (let i = 0; i < active_options.length; i++) {
                    let active_option = active_options[i];
                    active_option.removeAttribute('selected');
                    if (value == active_options[i].value) {
                        op_have = true;
                    }
                }
                if (!op_have) {
                    var newOption = document.createElement("option");
                    newOption.setAttribute("value", value);
                    var o_data = this.getAttribute('data-option-obj') || '';
                    if (o_data != null && o_data != '' && o_data != undefined) {
                        newOption.setAttribute("data-at-obj", o_data);
                    }
                    newOption.innerHTML = html;
                    activeElement.appendChild(newOption);
                }
                activeElement.value = value;

                if (value != '') {
                    let assir = activeAtSelectElement.querySelector(".at-select-selection-icon-remove");
                    assir.style.display = '';
                }

                const label = activeAtSelectElement.querySelector('.at-select-selection-label');
                label.innerHTML = html;
                label.classList.remove('placeholder');

                var atSelectContainerOpen = document.querySelector(".at-select-container--open");
                atSelectContainerOpen.remove();

                document.body.classList.remove("at-select-visible");
                document.body.style.position = "";

                var elements_dum = document.querySelectorAll(".at-select-container .at-select-selection");
                for (var i = 0; i < elements_dum.length; i++) {
                    elements_dum[i].classList.remove("show");
                }
            }
            atSelect.onSelectTrigger(activeElement);
        }
    },

    onSelectTrigger : function (activeElement) {
        if (activeElement) {
            activeElement.dispatchEvent(new Event("change"));
            let dataApi = activeElement.getAttribute('data-ats-get-api') || '';
            let dataFunc = activeElement.getAttribute('data-ats-get-func') || '';
            let onSelect = activeElement.getAttribute('data-ats-onselect') || '';
            let onSelectAdvance = activeElement.getAttribute('data-ats-onselect-adv') || '';

            if (onSelect != '' && onSelect != null && onSelect != undefined) {
                if (activeElement.classList.contains(atSelect.ATS_elementMultiselectClass)) {
                    var values = [];

                    for (var i = 0; i < activeElement.options.length; i++) {
                      if (activeElement.options[i].selected) {
                        values.push(activeElement.options[i].value);
                      }
                    }

                    let str = `${onSelect}(${JSON.stringify(values)})`;
                    var callFunc=new Function(eval("(" + str + ")"));
                } else {
                    let str = `${onSelect}('${activeElement.value}')`;
                    var callFunc=new Function(eval("(" + str + ")"));
                }
                callFunc();
            }

            if (onSelectAdvance != '' && onSelectAdvance != null && onSelectAdvance != undefined) {
                if (activeElement.classList.contains(atSelect.ATS_elementMultiselectClass)) {
                    var values = [];

                    for (var i = 0; i < activeElement.options.length; i++) {
                        if (activeElement.options[i].selected) {
                            if ((dataApi != '' && dataApi != null && dataApi != undefined) || (dataFunc != '' && dataFunc != null && dataFunc != undefined)) {
                                let optionObj = activeElement.options[i].getAttribute('data-at-obj');

                                try {
                                    let decrypted = CryptoJS.AES.decrypt(optionObj, 'APPTIMUS_L4QY2WETMO').toString(CryptoJS.enc.Utf8);
                                    d = JSON.parse(decrypted);
                                } catch (error) {
                                    d = {};
                                }
                            }
                            else {
                                d = {
                                    value: activeElement.options[i].value,
                                    text: activeElement.options[i].innerText,
                                }
                            }
                            values.push(d);
                        }
                    }

                    let str = `${onSelectAdvance}(${JSON.stringify(values)})`;
                    var callFunc=new Function(eval("(" + str + ")"));
                } else {
                    if ((dataApi != '' && dataApi != null && dataApi != undefined) || (dataFunc != '' && dataFunc != null && dataFunc != undefined)) {

                        let optionObj = activeElement.options[activeElement.selectedIndex].getAttribute('data-at-obj');

                        try {
                            let decrypted = CryptoJS.AES.decrypt(optionObj, 'APPTIMUS_L4QY2WETMO').toString(CryptoJS.enc.Utf8);
                            obj = JSON.parse(decrypted);
                        } catch (error) {
                            obj = {};
                        }
                    }
                    else {
                        var obj = {
                            value: activeElement.value,
                            text: activeElement.options[activeElement.selectedIndex]?.text || null,
                        }
                    }
                    let str = `${onSelectAdvance}(${JSON.stringify(obj)})`;
                    var callFunc=new Function(eval("(" + str + ")"));
                }
                callFunc();
            }
        }
    },

    optionHandleHover : function (e) {
        atSelect.ATS_isMouseOver = true;
        if (this.classList.contains("selectable")) {
            var elements_remove_high = document.querySelectorAll(".at-select-results .at-select-results__options .at-select-results__option");
            for (let ih = 0; ih < elements_remove_high.length; ih++) {
                elements_remove_high[ih].classList.remove('highlight');
            }
            this.classList.add('highlight');

            atSelect.optionHandleLastChild();
        }
    },

    optionHandleLastChild : function () {
        const atSelectSearchInput = document.querySelector(".at-select-search__field");
        const isApiSearch = atSelectSearchInput.getAttribute('data-ats-get-api') || '';
        const isFuncSearch = atSelectSearchInput.getAttribute('data-ats-get-func') || '';

        if ((isApiSearch != '' && isApiSearch != null && isApiSearch != undefined) || (isFuncSearch != '' && isFuncSearch != null && isFuncSearch != undefined)) {
            var ul = document.querySelector(".at-select-results .at-select-results__options");
            if (ul && !atSelect.ATS_DATA_IS_FULL && !atSelect.scrollbarVisible(ul)) {
                const isLastListItemSelected = document.querySelectorAll('.at-select-results .at-select-results__options .at-select-results__option:last-child')[0];
                if (isLastListItemSelected && isLastListItemSelected.classList.contains('highlight')) {
                    const openContainer = document.querySelector(".at-select-container--open");
                    if (openContainer) {
                        const id = openContainer.getAttribute('data-at-selected-container-id');
                        var activeElement = document.querySelector(`[data-at-container-id='${id}']`);
                        if (activeElement) {
                            const keydownEvent = new KeyboardEvent('keydown', {
                                bubbles: true,
                                cancelable: true,
                                keyCode: 65
                            });
                            if (atSelectSearchInput && activeElement && activeElement.querySelector('.at-select-selection')) {
                                atSelect.search(atSelectSearchInput, keydownEvent, activeElement.querySelector('.at-select-selection'),'append');
                            }
                        }
                    }
                }
            }
        }
    },

    optionsInitialize : function () {
        var elements = document.querySelectorAll(".at-select-results .at-select-results__options .at-select-results__option");
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeEventListener("click", atSelect.optionHandleClick);
            elements[i].addEventListener("click", atSelect.optionHandleClick);

            elements[i].removeEventListener("mouseover", atSelect.optionHandleHover);
            elements[i].addEventListener("mouseover", atSelect.optionHandleHover);

            elements[i].removeEventListener("mouseout", atSelect.optionHandleOut);
            elements[i].addEventListener("mouseout", atSelect.optionHandleOut);
        }
    },

    optionHandleOut : function (e) {
        atSelect.ATS_isMouseOver = false;
    },

    search : function (that, event, selectedElement, type) {
        const atSelectAddNewCont1 = document.querySelector(".at-select-results__options-add-new");
        const atSelectAddNewCont2 = document.querySelector(".at-select-results__options-add-new__cont");
        if (atSelectAddNewCont2) {
            atSelectAddNewCont2.remove();
        }

        if (atSelectAddNewCont1) {
            if (that.value == '') {
                atSelectAddNewCont1.innerText = "Add new";
            } else {
                atSelectAddNewCont1.innerText = "Add";
                var addNewoption1 = document.createElement("span");
                addNewoption1.classList.add('at-select-results__options-add-new__cont');
                addNewoption1.innerHTML = that.value;

                atSelectAddNewCont1.appendChild(addNewoption1);
            }
        }

        const ATS_UP = 38;
        const ATS_DOWN = 40;
        const ATS_LEFT = 37;
        const ATS_RIGHT = 39;
        const ATS_ENTER = 13;
        const ATS_ARROWS = [ATS_UP, ATS_DOWN, ATS_ENTER];
        const ATS_BROWSERARROWS = [ATS_UP, ATS_DOWN, ATS_LEFT, ATS_RIGHT, ATS_ENTER];
        let container, options, filter;
        filter = that.value.toLowerCase();
        container = that.closest('.at-select-dropdown');
        options = container.querySelectorAll('.at-select-results__option');
        var visibleListItems = Array.from(container.querySelectorAll(".at-select-results__option.selectable"));
        var selectedListItem = container.querySelector(".at-select-results__option.highlight");
        var selectedIndex = visibleListItems.indexOf(selectedListItem);

        const ATS_API_URL = that.getAttribute('data-ats-get-api');
        const ATS_FUNCTION = that.getAttribute('data-ats-get-func');

        if (ATS_ARROWS.includes(event.which)) {
            if (event.which == ATS_DOWN) {
                var hasSelected = false;
                for (let i = 0; i < options.length; i++) {
                    var li = options[i];
                    if (li.classList.contains("highlight")) {
                        hasSelected = true;
                        break;
                    }
                }

                if (hasSelected) {
                    if (selectedIndex + 1 < visibleListItems.length) {
                        selectedListItem.classList.remove("highlight");
                        let nextSelected = selectedListItem.nextElementSibling;
                        while (nextSelected && (nextSelected.classList.contains("disabled") || nextSelected.style.display === 'none')) {
                            nextSelected = nextSelected.nextElementSibling;
                        }
                        if (nextSelected) {
                            nextSelected.classList.add("highlight");
                        }
                    }
                }
                else if (options[0]) {
                    options[0].classList.add('highlight');
                }

                atSelect.optionHandleLastChild();

                // if (ATS_API_URL != null && ATS_API_URL != '' && ATS_API_URL != undefined) {
                //     let obj = container.find("ul")[0];
                //     if (!scrollbarVisible(obj)) {
                //         if( obj.scrollTop >= (obj.scrollHeight - obj.offsetHeight))
                //         {
                //             if ($(container).find("ul li:last-child").hasClass('selected')) {
                //                 S_PAGE++;
                //                 atSearch(container,'append');
                //             }
                //         }
                //     }
                // }
            }
            else if (event.which == ATS_UP) {
                if (selectedIndex > 0) {
                    selectedListItem.classList.remove("highlight");
                    let prevSelected = selectedListItem.previousElementSibling;
                    while (prevSelected && (prevSelected.classList.contains("disabled") || prevSelected.style.display === 'none')) {
                        prevSelected = prevSelected.previousElementSibling;
                    }
                    if (prevSelected) {
                        prevSelected.classList.add("highlight");
                    }
                }
            } else if (event.which == ATS_ENTER) {
                selectedListItem.click();
            }

            // if (selectedListItem) {
            //     container.querySelector('.at-select-results__options').scrollIntoView({
            //         behavior: "smooth",
            //     });
            // }
        } else {
            if (!ATS_BROWSERARROWS.includes(event.which)) {
                if ((ATS_API_URL != null && ATS_API_URL != '' && ATS_API_URL != undefined) || (ATS_FUNCTION != null && ATS_FUNCTION != '' && ATS_FUNCTION != undefined)) {
                    // search from db

                    if(atSelect.ATS_isFirstSearch) {
                        clearTimeout(ata_myVar);
                    }

                    atSelect.ATS_isFirstSearch = true;
                    ata_myVar = setTimeout(() => {
                        // container.find("ul").html();
                        // setTimeout(() => {
                        //     atPrintAddNewBtn(container);
                        // }, 0);
                        // atSearch(container,'html');

                        const optionsListLoader = document.querySelector('.at-select-dropdown .at-select-results .at-select-results__options .at-select-results__option_loader');
                        const optionsListMsg = document.querySelector('.at-select-dropdown .at-select-results .at-select-results__options .at-select-results__option_msg');
                        if (optionsListLoader) {
                            optionsListLoader.remove();
                        }
                        if (optionsListMsg) {
                            optionsListMsg.remove();
                        }

                        const optionsList = document.querySelector('.at-select-dropdown .at-select-results .at-select-results__options');
                        var li = document.createElement('li');
                        li.setAttribute('class', 'at-select-results__option_loader');
                        li.style.textAlign = 'center';
                        li.style.color = '#6c757d !important';
                        li.style.fontSize = '14px';


                        var div = document.createElement('div');
                        div.setAttribute('class', 'at-select-loader');

                        var dot = document.createElement('div');
                        dot.setAttribute('class', 'at-select-dot');

                        div.appendChild(dot.cloneNode(true));
                        div.appendChild(dot.cloneNode(true));
                        div.appendChild(dot.cloneNode(true));
                        li.appendChild(div);
                        if (optionsList) {
                            optionsList.appendChild(li);
                        }

                        if (type == 'html') {
                            atSelect.ATS_DATA_IS_FULL = false;
                            atSelect.ATS_PAGE = 1;
                        }
                        else {
                            atSelect.ATS_PAGE++;
                        }

                        var at_select_id_abort = selectedElement.parentNode.getAttribute('data-at-container-id');
                        if (ATS_API_URL != null && ATS_API_URL != '' && ATS_API_URL != undefined) {
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", ATS_API_URL+(ATS_API_URL.includes("?") ? "&" : "?" )+"search="+filter+"&page="+atSelect.ATS_PAGE, true);
                            xhr.onreadystatechange = function() {
                                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                    let response = JSON.parse(xhr.responseText);
                                    var openContainer = document.querySelector('.at-select-container--open');
                                    if (openContainer && openContainer.getAttribute('data-at-selected-container-id') == at_select_id_abort) {
                                        atSelect.printList(response?.data?.data || [],selectedElement);
                                    }
                                }
                            };
                            xhr.send();
                        } else {
                            const atSelectSearchInput = document.querySelector(".at-select-search__field");
                            if (atSelectSearchInput) {
                                let openCont = atSelectSearchInput.closest('.at-select-container--open');
                                if (openCont && openCont.getAttribute('data-at-selected-container-id') == at_select_id_abort) {
                                    let ats_id = openCont.getAttribute('data-at-selected-container-id');
                                    let str = `${ATS_FUNCTION}('${ats_id}','${atSelectSearchInput.value}',${atSelect.ATS_PAGE})`;
                                    var getFunc=new Function(eval("(" + str + ")"));
                                    getFunc();
                                }
                            }
                        }
                    }, 300);
                }
                else {
                    for (i = 0; i < options.length; i++) {
                        txtValue = options[i].textContent || options[i].innerText;
                        if (txtValue.toLowerCase().indexOf(filter) > -1) {
                            options[i].style.display = "";
                            if (!options[i].classList.contains('disabled')) {
                                options[i].classList.add('selectable');
                            }
                        } else {
                            options[i].style.display = "none";
                            options[i].classList.remove('selectable');
                        }
                        options[i].classList.remove('highlight');
                    }
                    let filter_options = container.querySelectorAll('.at-select-results__option.selectable');
                    for (ic = 0; ic < filter_options.length; ic++) {
                        if (filter_options[ic].style.display != 'none') {
                            filter_options[ic].classList.add('highlight');
                            break;
                        }
                    }
                }
            }
        }
    },

    printList : function (list='',selectedElement) {
        list = list == '' ? [] : list;
        type = atSelect.ATS_PAGE == 1 ? 'html' : 'append';
        const optionsListLoader = document.querySelector('.at-select-dropdown .at-select-results .at-select-results__options .at-select-results__option_loader');
        const optionsListMsg = document.querySelector('.at-select-dropdown .at-select-results .at-select-results__options .at-select-results__option_msg');
        if (optionsListLoader) {
            optionsListLoader.remove();
        }
        if (optionsListMsg) {
            optionsListMsg.remove();
        }

        if (type == 'html') {
            const listItem = document.querySelectorAll(".at-select-dropdown .at-select-results .at-select-results__options .at-select-results__option");
            listItem.forEach(li => {
                li.remove();
            });
            // atPrintAddNewBtn(container,'selected');
        }

        const listItems = document.querySelector(".at-select-dropdown .at-select-results .at-select-results__options");
        if (list.length == 0) {
            const oli = document.querySelectorAll(".at-select-dropdown .at-select-results .at-select-results__options .at-select-results__option");
            if (oli.length == 0) {
                var li = document.createElement('li');
                li.setAttribute('class', 'at-select-results__option_msg');
                li.style.textAlign = 'center';
                li.style.color = '#6c757d !important';
                li.style.fontSize = '14px';
                li.innerHTML = 'Sorry, no results found';
                if (listItems) {
                    listItems.appendChild(li);
                }
            }
            else {
                atSelect.ATS_DATA_IS_FULL = true;
            }
        } else {
            var at_select_id = selectedElement.parentNode.getAttribute('data-at-container-id');
            var activeAtSelectElement = document.querySelector(`[data-at-id='${at_select_id}']`);
            let active_element_is_multiple = activeAtSelectElement.classList.contains(atSelect.ATS_elementMultiselectClass);

            list.forEach(obj => {
                var li = document.createElement('li');
                li.setAttribute('class', 'at-select-results__option selectable');
                li.setAttribute('data-option-value', obj.id || obj.value);
                li.setAttribute('data-option-id', at_select_id);

                var encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), 'APPTIMUS_L4QY2WETMO');
                li.setAttribute('data-option-obj', encrypted);

                li.innerHTML = obj.name || obj.title || obj.description || obj.text;

                if (!active_element_is_multiple && (obj.id == activeAtSelectElement.value || obj.value == activeAtSelectElement.value)) {
                    li.classList.add('selected');
                }

                var selectedMultipleItems = [];
                for (let si = 0; si < activeAtSelectElement.options.length; si++) {
                    const ob = activeAtSelectElement.options[si];
                    if (ob.selected) {
                        selectedMultipleItems.push(ob.value);
                    }

                }

                if (active_element_is_multiple) {
                    for (let ex = 0; ex < selectedMultipleItems.length; ex++) {
                        const el = selectedMultipleItems[ex];
                        if (obj.id == el || obj.value == el) {
                            li.classList.add('selected');
                            break;
                        }
                    }
                }

                if (listItems) {
                    listItems.appendChild(li);
                }
            });

            if (listItems) {
                const atSelectSearchInput = document.querySelector(".at-select-search__field");
                const CUR_listItems = document.querySelector(".at-select-dropdown .at-select-results .at-select-results__options");
                CUR_listItems.addEventListener("scroll", function() {
                    if (!atSelect.ATS_DATA_IS_FULL && this.scrollHeight - this.scrollTop - this.clientHeight<=1) {
                        const keydownEvent = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 65
                        });
                        atSelect.search(atSelectSearchInput, keydownEvent, selectedElement,'append');
                    }
                });
            }

            atSelect.optionsInitialize();
            if (!atSelect.ATS_isMouseOver) {
                let elements_remove_high = document.querySelectorAll(".at-select-results .at-select-results__options .at-select-results__option");
                for (let ih = 0; ih < elements_remove_high.length; ih++) {
                    elements_remove_high[ih].classList.remove('highlight');
                }
                if (elements_remove_high[0]) {
                    elements_remove_high[0].classList.add('highlight');
                }
            }
            atSelect.optionHandleLastChild();
        }
    },

    scrollbarVisible : function (element) {
        return element.scrollHeight > element.clientHeight;
    },

    generateRandomString : function (length) {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;

    }
}

export default atSelect;
