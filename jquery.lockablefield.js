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

            var $this = $(this),
                $label = $this,
                $input = $this.find("input:first");

            settings = $.extend(settings, $this.data('_LockableFieldSettings'), options);

            $label.addClass("lockablefield");

            $input.prop("disabled", !settings["unlockable"])

            if($this.find(".lf-container").length === 0) {
                $input.wrap("<div class='lf-container'></div>");
            }
            var $container = $this.find(".lf-container");

            $label.find(".lf-btn").remove();
            $container.prepend("<div class='lf-btn'></div>");
            var $btn = $label.find(".lf-btn");

            if(settings["icons"] == "fontawesome") {
                var locked_btn_html = "<i class='fa fa-toggle-on'></i>",
                unlocked_btn_html = "<i class='fa fa-toggle-off'></i>";
            } else {
                var locked_btn_html = "<span class='lf-emoji-icon'>&#128274;</div>",
                unlocked_btn_html = "<span class='lf-emoji-icon'>&#128275;</div>";
            }
            $this.css({
                "position":"relative"
            });

            $input.css({
                "padding-left": 28
            });

            $("head").append("<style>.lf-container:after{ clear: both; content: ''; display: table; }</style>");

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

            var updateButton = function(){

                $this.attr("data-locked", settings["locked"])
                if(settings['locked']) {
                    $label.addClass("lf-locked");
                    $btn.html(locked_btn_html);

                    $input.css("background-color", settings['lockedInputFillColor']);
                    $btn.css("background-color", settings['lockedButtonFillColor']);
                } else {
                    $label.removeClass("lf-locked");
                    $btn.html(unlocked_btn_html);

                    $input.css("background-color", settings['unlockedInputFillColor']);
                    $btn.css("background-color", settings['unlockedButtonFillColor']);
                }

                settings.onChange();
            };

            updateButton();

            // Bind our geocoding operation to the input entry
            $btn.on("click", function (event) {
                event.preventDefault();
                if(!settings["unlockable"]) { return false; }
                settings['locked'] = !settings['locked'];
                updateButton();
            });

            $input.on("click", function (event) {
                event.preventDefault();
                if(settings['locked']) {
                    if(!settings["unlockable"]) { return false; }
                    settings['locked'] = !settings['locked'];
                    updateButton();
                }
            });

            $this.data('_LockableFieldSettings', settings);
        });
    };
})(jQuery);
