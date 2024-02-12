(function($) {
    var openDropdown = null; // Track the currently open dropdown

    var CheckboxDropdown = function(el) {
        var _this = this;
        this.isOpen = false;
        this.areAllChecked = false;
        this.$el = $(el);
        this.$label = this.$el.find('.dropdown-label');
        this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
        this.$inputs = this.$el.find('[type="checkbox"]');
        
        this.onCheckBox();
        
        this.$label.on('click', function(e) {
            e.preventDefault();
            // Close the currently open dropdown before toggling the clicked one
            if (openDropdown && openDropdown !== _this) {
                openDropdown.toggleOpen(false); // Force close the other dropdown
            }
            _this.toggleOpen();
        });
        
        this.$checkAll.on('click', function(e) {
            e.preventDefault();
            _this.onCheckAll();
        });
        
        this.$inputs.on('change', function(e) {
            _this.onCheckBox();
        });
    };

    CheckboxDropdown.prototype.onCheckBox = function() {
        this.updateStatus();
    };

    CheckboxDropdown.prototype.updateStatus = function() {
        var checked = this.$el.find(':checked');
        
        this.areAllChecked = false;
        this.$checkAll.html('Check All');
        
        if(checked.length <= 0) {
            this.$label.html('Select Options');
        }
        else if(checked.length === 1) {
            this.$label.html(checked.parent('label').text());
        }
        else if(checked.length === this.$inputs.length) {
            this.$label.html('All Selected');
            this.areAllChecked = true;
            this.$checkAll.html('Uncheck All');
        }
        else {
            this.$label.html(checked.length + ' Selected');
        }
    };

    CheckboxDropdown.prototype.onCheckAll = function(checkAll) {
        if(!this.areAllChecked || checkAll) {
            this.areAllChecked = true;
            this.$checkAll.html('Uncheck All');
            this.$inputs.prop('checked', true);
        }
        else {
            this.areAllChecked = false;
            this.$checkAll.html('Check All');
            this.$inputs.prop('checked', false);
        }
        
        this.updateStatus();
    };

    CheckboxDropdown.prototype.toggleOpen = function(forceOpen) {
        var _this = this;

        if(!this.isOpen || forceOpen) {
            if(openDropdown && openDropdown !== _this) {
                openDropdown.toggleOpen(false); // Ensure to close the previously open dropdown
            }
            this.isOpen = true;
            this.$el.addClass('on');
            openDropdown = _this; // Update the globally tracked open dropdown
            $(document).on('click', function(e) {
                if(!$(e.target).closest(_this.$el).length) {
                    _this.toggleOpen(false);
                }
            });
        }
        else {
            this.isOpen = false;
            this.$el.removeClass('on');
            $(document).off('click');
            if (openDropdown === _this) {
                openDropdown = null; // Clear the global reference if this dropdown is being closed
            }
        }
    };

    // Initialize all instances of the dropdowns
    var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
    for(var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
        new CheckboxDropdown(checkboxesDropdowns[i]);
    }
})(jQuery);



  