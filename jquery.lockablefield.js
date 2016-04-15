//! jquery-lockablefield
//! version : 0.0.1b
//! authors : @charlex

(function($) {
    'use strict';

    $.fn.isLocked = function() {
        if($(this).attr("data-locked") === "true") {
            return true;
        } else {
            return false;
        }
    };
    $.fn.isUnlocked = function() {
        if($(this).attr("data-locked") === "false") {
            return true;
        } else {
            return false;
        }
    };

    $.fn.lockableField = function(options) {

        return this.each(function() {
            var $this = $(this),
            $input = $this;

            /* If if it's not an input field, throw an error. */
            if(!$this.is("input")) {
                throw "lockableField error: must be applied to input element. " + $this.prop('tagName') + "#" + $this.attr("id");
                return false;
            }

            /* Combine the default settings, with existing settings, and any new settings */
            var settings = {
                'locked': true,
                'unlockable': true,
                'icons': "emoji",
                'unlockedButtonFillColor': "#D6E8F5",
                'unlockedInputFillColor': "#D6E8F5",
                'lockedButtonFillColor': "initial",
                'lockedInputFillColor': "#FFFFFF",
                'extraButtonStyles': {},
                'onChange': function(){}
            };
            settings = $.extend(settings, $this.data('_LockableFieldSettings'), options);

            /* Use emoji as a fallback if fontawesome isn't chosen. */
            if(settings["icons"] == "fontawesome") {
                var locked_btn_html = "<i class='lf-fa fa fa-toggle-on'></i>",
                unlocked_btn_html = "<i class='lf-fa fa fa-toggle-off'></i>";
            } else {
                var locked_btn_html = "<span class='lf-emoji-icon'>&#128274;</div>",
                unlocked_btn_html = "<span class='lf-emoji-icon'>&#128275;</div>";
            }

            /* Wrap the input in a container */
            if($this.parent(".lf-container").length == 0) {
                $input.wrap("<div class='lf-container' style='position:relative;'></div>");
            }
            var $container = $this.parent(".lf-container");

            /* Apply a clearfix to the container */
            $("head").append("<style>.lf-container:after{ clear: both; content: ''; display: table; }</style>");

            /* Prepend the lock button to the container */
            $container.find(".lf-btn").remove();
            if($container.find(".lf-btn").length == 0) {
                $container.prepend("<div class='lf-btn'></div>");
            }
            var $btn = $container.find(".lf-btn");

            /* Style the button */
            var button_styles = $.extend({
                    "float": "left",
                    "position": "absolute",
                    "cursor": "pointer",
                    "font-size": 16,
                    "padding-top": ($container.height()/2) - 8,
                    "padding-left": 5,
                    "padding-bottom": ($input.height())/2,
                    "left": 0,
                },
                settings['extraButtonStyles']
            );
            if(!settings['unlockable']) {
                button_styles["cursor"] = "not-allowed";
            }
            $btn.css(button_styles);

            /* Style the input */
            $input.css({ "padding-left": 28 });

            /* the updateButton() function is called to change the button when
               the lock status has been changed */
            var updateButton = function(){
                $this.attr("data-locked", settings["locked"])
                if(settings['locked']) {
                    $container.addClass("lf-locked");
                    $btn.html(locked_btn_html);

                    $input.css("background-color", settings['lockedInputFillColor']);
                    $btn.css("background-color", settings['lockedButtonFillColor']);
                } else {
                    $container.removeClass("lf-locked");
                    $btn.html(unlocked_btn_html);

                    $input.css("background-color", settings['unlockedInputFillColor']);
                    $btn.css("background-color", settings['unlockedButtonFillColor']);
                }

                /* Call the user's callback function */
                settings.onChange();
            };

            /* Call updateButton() on each initialization */
            updateButton();

            /* List for button clicks to both lock and unlock the field */
            $btn.on("click", function (event) {
                event.preventDefault();
                if(!settings["unlockable"]) { return false; }
                settings['locked'] = !settings['locked'];
                updateButton();
            });

            /* List for input clicks and focuses to only unlock the field */
            $input.on("click focus", function (event) {
                event.preventDefault();
                if(settings['locked']) {
                    if(!settings["unlockable"]) { return false; }
                    settings['locked'] = !settings['locked'];
                    updateButton();
                }
            });

            /* Store all of the settings to be retrieved the next
               time lockableField() is applied */
            $this.data('_LockableFieldSettings', settings);
        });
    };
})(jQuery);
