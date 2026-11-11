/* https://github.com/tylerecouture/summernote-lists  */
/* https://github.com/tylerecouture/summernote-table-styles */
/* https://github.com/david-meneses/summernote-table-styles */


(function (factory) {
  /* global define */
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node/CommonJS
    module.exports = factory(require("jquery"));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
})(function ($) {
  $.extend(true, $.summernote.lang, {
    "en-US": {
      tableStyles: {
        tooltip: "Table style",
        stylesExclusive: ["Basic", "Bordered"],
        stylesInclusive: ["Striped", "Condensed", "Hoverable"]
      }
    }
  });
  $.extend($.summernote.options, {
    tableStyles: {
      // Must keep the same order as in lang.tableStyles.styles*
      stylesExclusive: ["border border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_td]:border [&_td]:border-gray-300", "border border-collapse [&_th]:border [&_th]:border-gray-900 [&_td]:border [&_td]:border-gray-900"],
      stylesInclusive: ["[&_tbody_tr:nth-child(odd)]:bg-gray-100", "text-sm", "[&_tbody_tr:hover]:bg-gray-100"]
    }
  });

  // Extends plugins for emoji plugin.
  $.extend($.summernote.plugins, {
    tableStyles: function (context) {
      var self = this,
        ui = $.summernote.ui,
        options = context.options,
        lang = options.langInfo;

      context.memo("button.tableStyles", function () {
        var button = ui.buttonGroup([
          ui.button({
            className: "dropdown-toggle",
            container: options.container,
            contents: ui.dropdownButtonContents(
              ui.icon(options.icons.magic),
              options
            ),
            tooltip: lang.tableStyles.tooltip,
            data: {
              toggle: "dropdown"
            },
            callback: function ($dropdownBtn) {
              $dropdownBtn[0].addEventListener("click", function () {
                self.updateTableMenuState($dropdownBtn);
              }, true);
            }
          }),
          ui.dropdownCheck({
            className: "dropdown-table-style",
            checkClassName: options.icons.menuCheck,
            items: self.generateListItems(
              options.tableStyles.stylesExclusive,
              lang.tableStyles.stylesExclusive,
              options.tableStyles.stylesInclusive,
              lang.tableStyles.stylesInclusive
            ),
            callback: function ($dropdown) {
              $dropdown.find("a").each(function () {
                $(this).click(function (e) {
                  self.updateTableStyles(this);
                  e.preventDefault();
                });
              });
            }
          })
        ]);
        return button.render();
      });

      self.updateTableStyles = function (chosenItem) {
        const rng = context.invoke("editor.getLastRange");
        const dom = $.summernote.dom;
        if (rng.isCollapsed() && rng.isOnCell()) {
          var table = dom.ancestor(rng.commonAncestor(), dom.isTable);
          self.updateStyles(
            $(table),
            chosenItem,
            options.tableStyles.stylesExclusive
          );
        }
      };

      /* Makes sure the check marks are on the currently applied styles */
      self.updateTableMenuState = function ($dropdownButton) {
        const rng = context.invoke("editor.getLastRange");
        const dom = $.summernote.dom;
        if (rng.isCollapsed() && rng.isOnCell()) {
          var $table = $(dom.ancestor(rng.commonAncestor(), dom.isTable));
          var $listItems = $dropdownButton.parent().find(".note-dropdown-menu a");
          self.updateMenuState(
            $table,
            $listItems,
            options.tableStyles.stylesExclusive
          );
        }
      };

      /* The following functions might be turnkey in other menu lists
            with exclusive and inclusive items that toggle CSS classes. */

      self.updateMenuState = function ($node, $listItems, exclusiveStyles) {
        var hasAnExclusiveStyle = false;
        $listItems.each(function () {
          var cssClass = $(this).data("value");
          if (cssClass && cssClass.split(/\s+/).every(function (name) { return $node.hasClass(name); })) {
            $(this).addClass("checked");
            if ($.inArray(cssClass, exclusiveStyles) != -1) {
              hasAnExclusiveStyle = true;
            }
          } else {
            $(this).removeClass("checked");
          }
        });

        // if none of the exclusive styles are checked, then check a blank
        if (!hasAnExclusiveStyle) {
          $listItems.filter('[data-value=""]').addClass("checked");
        }
      };

      self.updateStyles = function ($node, chosenItem, exclusiveStyles) {
        var cssClass = $(chosenItem).data("value");
        context.invoke("beforeCommand");

        // Exclusive class: only one can be applied one at a time
        if ($.inArray(cssClass, exclusiveStyles) != -1) {
          // Remove all exclusive styles
          exclusiveStyles.forEach(function (style) {
            if (style) {
              $node.removeClass(style);
            }
          });

          // Remove Bootstrap table-bordered class
          $node.removeClass("table-bordered");

          // Add new exclusive style
          if (cssClass) {
            $node.addClass(cssClass);
          }
        } else {
          // Inclusive classes: multiple are ok
          $node.toggleClass(cssClass);
        }
        context.invoke("afterCommand");
      };

      self.generateListItems = function (
        exclusiveStyles,
        exclusiveLabels,
        inclusiveStyles,
        inclusiveLabels
      ) {
        var index = 0;
        var list = "";

        for (const style of exclusiveStyles) {
          list += self.getListItem(style, exclusiveLabels[index], true);
          index++;
        }
        list += '<hr style="margin: 5px 0px">';
        index = 0;
        for (const style of inclusiveStyles) {
          list += self.getListItem(style, inclusiveLabels[index], false);
          index++;
        }
        return list;
      };

      self.getListItem = function (
        value,
        label,
        isExclusive,
      ) {
        var item =
          '<li><a href="#" class="' +
          (isExclusive ? "exclusive-item" : "inclusive-item") +
          '" ' +
          'style="display: block;" data-value="' +
          value +
          '">' +
          '<i class="note-icon-menu-check" ' +
          (!isExclusive ? 'style="color:#00ffc0;" ' : "") +
          "></i>" +
          " " +
          label +
          "</a></li>";
        return item;
      };
    }
  });
});
