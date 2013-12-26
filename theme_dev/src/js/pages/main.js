
define('text!templates/BodyTpl.html',[],function () { return '<div id="example-grid"></div>';});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (root, $, _, Backbone) {

  "use strict";
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

var window = root;

// Copyright 2009, 2010 Kristopher Michael Kowal
// https://github.com/kriskowal/es5-shim
// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
  "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
  "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
  // http://blog.stevenlevithan.com/archives/faster-trim-javascript
  // http://perfectionkills.com/whitespace-deviations/
  ws = "[" + ws + "]";
  var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
  trimEndRegexp = new RegExp(ws + ws + "*$");
  String.prototype.trim = function trim() {
    if (this === undefined || this === null) {
      throw new TypeError("can't convert " + this + " to object");
    }
    return String(this)
      .replace(trimBeginRegexp, "")
      .replace(trimEndRegexp, "");
  };
}

function capitalize(s) {
  return String.fromCharCode(s.charCodeAt(0) - 32) + s.slice(1);
}

function lpad(str, length, padstr) {
  var paddingLen = length - (str + '').length;
  paddingLen =  paddingLen < 0 ? 0 : paddingLen;
  var padding = '';
  for (var i = 0; i < paddingLen; i++) {
    padding = padding + padstr;
  }
  return padding + str;
}

var Backgrid = root.Backgrid = {

  VERSION: "0.2.6",

  Extension: {},

  requireOptions: function (options, requireOptionKeys) {
    for (var i = 0; i < requireOptionKeys.length; i++) {
      var key = requireOptionKeys[i];
      if (_.isUndefined(options[key])) {
        throw new TypeError("'" + key  + "' is required");
      }
    }
  },

  resolveNameToClass: function (name, suffix) {
    if (_.isString(name)) {
      var key = _.map(name.split('-'), function (e) { return capitalize(e); }).join('') + suffix;
      var klass = Backgrid[key] || Backgrid.Extension[key];
      if (_.isUndefined(klass)) {
        throw new ReferenceError("Class '" + key + "' not found");
      }
      return klass;
    }

    return name;
  },

    /**
     * Have been fixed for IE 8
     * @returns {*}
     */
    callByNeed: function () {
        var value = arguments[0];
        if (!_.isFunction(value)) return value;

        var context = arguments[1];
        var args = Array.prototype.slice.call(arguments, 2);
        return value.apply(context || {}, !!(args + '') ? args : []);
    }
};
_.extend(Backgrid, Backbone.Events);

/**
   Command translates a DOM Event into commands that Backgrid
   recognizes. Interested parties can listen on selected Backgrid events that
   come with an instance of this class and act on the commands.

   It is also possible to globally rebind the keyboard shortcuts by replacing
   the methods in this class' prototype.

   @class Backgrid.Command
   @constructor
 */
var Command = Backgrid.Command = function (evt) {
  _.extend(this, {
    altKey: !!evt.altKey,
    char: evt.char,
    charCode: evt.charCode,
    ctrlKey: !!evt.ctrlKey,
    key: evt.key,
    keyCode: evt.keyCode,
    locale: evt.locale,
    location: evt.location,
    metaKey: !!evt.metaKey,
    repeat: !!evt.repeat,
    shiftKey: !!evt.shiftKey,
    which: evt.which
  });
};
_.extend(Command.prototype, {
  /**
     Up Arrow

     @member Backgrid.Command
   */
  moveUp: function () { return this.keyCode == 38; },
  /**
     Down Arrow

     @member Backgrid.Command
   */
  moveDown: function () { return this.keyCode === 40; },
  /**
     Shift Tab

     @member Backgrid.Command
   */
  moveLeft: function () { return this.shiftKey && this.keyCode === 9; },
  /**
     Tab

     @member Backgrid.Command
   */
  moveRight: function () { return !this.shiftKey && this.keyCode === 9; },
  /**
     Enter

     @member Backgrid.Command
   */
  save: function () { return this.keyCode === 13; },
  /**
     Esc

     @member Backgrid.Command
   */
  cancel: function () { return this.keyCode === 27; },
  /**
     None of the above.

     @member Backgrid.Command
   */
  passThru: function () {
    return !(this.moveUp() || this.moveDown() || this.moveLeft() ||
             this.moveRight() || this.save() || this.cancel());
  }
});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   Just a convenient class for interested parties to subclass.

   The default Cell classes don't require the formatter to be a subclass of
   Formatter as long as the fromRaw(rawData) and toRaw(formattedData) methods
   are defined.

   @abstract
   @class Backgrid.CellFormatter
   @constructor
*/
var CellFormatter = Backgrid.CellFormatter = function () {};
_.extend(CellFormatter.prototype, {

  /**
     Takes a raw value from a model and returns an optionally formatted string
     for display. The default implementation simply returns the supplied value
     as is without any type conversion.

     @member Backgrid.CellFormatter
     @param {*} rawData
     @return {*}
  */
  fromRaw: function (rawData) {
    return rawData;
  },

  /**
     Takes a formatted string, usually from user input, and returns a
     appropriately typed value for persistence in the model.

     If the user input is invalid or unable to be converted to a raw value
     suitable for persistence in the model, toRaw must return `undefined`.

     @member Backgrid.CellFormatter
     @param {string} formattedData
     @return {*|undefined}
  */
  toRaw: function (formattedData) {
    return formattedData;
  }

});

/**
   A floating point number formatter. Doesn't understand notation at the moment.

   @class Backgrid.NumberFormatter
   @extends Backgrid.CellFormatter
   @constructor
   @throws {RangeError} If decimals < 0 or > 20.
*/
var NumberFormatter = Backgrid.NumberFormatter = function (options) {
  options = options ? _.clone(options) : {};
  _.extend(this, this.defaults, options);

  if (this.decimals < 0 || this.decimals > 20) {
    throw new RangeError("decimals must be between 0 and 20");
  }
};
NumberFormatter.prototype = new CellFormatter();
_.extend(NumberFormatter.prototype, {

  /**
     @member Backgrid.NumberFormatter
     @cfg {Object} options

     @cfg {number} [options.decimals=2] Number of decimals to display. Must be an integer.

     @cfg {string} [options.decimalSeparator='.'] The separator to use when
     displaying decimals.

     @cfg {string} [options.orderSeparator=','] The separator to use to
     separator thousands. May be an empty string.
   */
  defaults: {
    decimals: 2,
    decimalSeparator: '.',
    orderSeparator: ','
  },

  HUMANIZED_NUM_RE: /(\d)(?=(?:\d{3})+$)/g,

  /**
     Takes a floating point number and convert it to a formatted string where
     every thousand is separated by `orderSeparator`, with a `decimal` number of
     decimals separated by `decimalSeparator`. The number returned is rounded
     the usual way.

     @member Backgrid.NumberFormatter
     @param {number} number
     @return {string}
  */
  fromRaw: function (number) {
    if (_.isNull(number) || _.isUndefined(number)) return '';

    number = number.toFixed(~~this.decimals);

    var parts = number.split('.');
    var integerPart = parts[0];
    var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';

    return integerPart.replace(this.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
  },

  /**
     Takes a string, possibly formatted with `orderSeparator` and/or
     `decimalSeparator`, and convert it back to a number.

     @member Backgrid.NumberFormatter
     @param {string} formattedData
     @return {number|undefined} Undefined if the string cannot be converted to
     a number.
  */
  toRaw: function (formattedData) {
    var rawData = '';

    var thousands = formattedData.trim().split(this.orderSeparator);
    for (var i = 0; i < thousands.length; i++) {
      rawData += thousands[i];
    }

    var decimalParts = rawData.split(this.decimalSeparator);
    rawData = '';
    for (var i = 0; i < decimalParts.length; i++) {
      rawData = rawData + decimalParts[i] + '.';
    }

    if (rawData[rawData.length - 1] === '.') {
      rawData = rawData.slice(0, rawData.length - 1);
    }

    var result = (rawData * 1).toFixed(~~this.decimals) * 1;
    if (_.isNumber(result) && !_.isNaN(result)) return result;
  }

});

/**
   Formatter to converts between various datetime formats.

   This class only understands ISO-8601 formatted datetime strings and UNIX
   offset (number of milliseconds since UNIX Epoch). See
   Backgrid.Extension.MomentFormatter if you need a much more flexible datetime
   formatter.

   @class Backgrid.DatetimeFormatter
   @extends Backgrid.CellFormatter
   @constructor
   @throws {Error} If both `includeDate` and `includeTime` are false.
*/
var DatetimeFormatter = Backgrid.DatetimeFormatter = function (options) {
  options = options ? _.clone(options) : {};
  _.extend(this, this.defaults, options);

  if (!this.includeDate && !this.includeTime) {
    throw new Error("Either includeDate or includeTime must be true");
  }
};
DatetimeFormatter.prototype = new CellFormatter();
_.extend(DatetimeFormatter.prototype, {

  /**
     @member Backgrid.DatetimeFormatter

     @cfg {Object} options

     @cfg {boolean} [options.includeDate=true] Whether the values include the
     date part.

     @cfg {boolean} [options.includeTime=true] Whether the values include the
     time part.

     @cfg {boolean} [options.includeMilli=false] If `includeTime` is true,
     whether to include the millisecond part, if it exists.
   */
  defaults: {
    includeDate: true,
    includeTime: true,
    includeMilli: false
  },

  DATE_RE: /^([+\-]?\d{4})-(\d{2})-(\d{2})$/,
  TIME_RE: /^(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?$/,
  ISO_SPLITTER_RE: /T|Z| +/,

  _convert: function (data, validate) {
    var date, time = null;
    if (_.isNumber(data)) {
      var jsDate = new Date(data);
      date = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
      time = lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);
    }
    else {
      data = data.trim();
      var parts = data.split(this.ISO_SPLITTER_RE) || [];
      date = this.DATE_RE.test(parts[0]) ? parts[0] : '';
      time = date && parts[1] ? parts[1] : this.TIME_RE.test(parts[0]) ? parts[0] : '';
    }

    var YYYYMMDD = this.DATE_RE.exec(date) || [];
    var HHmmssSSS = this.TIME_RE.exec(time) || [];

    if (validate) {
      if (this.includeDate && _.isUndefined(YYYYMMDD[0])) return;
      if (this.includeTime && _.isUndefined(HHmmssSSS[0])) return;
      if (!this.includeDate && date) return;
      if (!this.includeTime && time) return;
    }

    var jsDate = new Date(Date.UTC(YYYYMMDD[1] * 1 || 0,
                                   YYYYMMDD[2] * 1 - 1 || 0,
                                   YYYYMMDD[3] * 1 || 0,
                                   HHmmssSSS[1] * 1 || null,
                                   HHmmssSSS[2] * 1 || null,
                                   HHmmssSSS[3] * 1 || null,
                                   HHmmssSSS[5] * 1 || null));

    var result = '';

    if (this.includeDate) {
      result = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
    }

    if (this.includeTime) {
      result = result + (this.includeDate ? 'T' : '') + lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);

      if (this.includeMilli) {
        result = result + '.' + lpad(jsDate.getUTCMilliseconds(), 3, 0);
      }
    }

    if (this.includeDate && this.includeTime) {
      result += "Z";
    }

    return result;
  },

  /**
     Converts an ISO-8601 formatted datetime string to a datetime string, date
     string or a time string. The timezone is ignored if supplied.

     @member Backgrid.DatetimeFormatter
     @param {string} rawData
     @return {string|null|undefined} ISO-8601 string in UTC. Null and undefined
     values are returned as is.
  */
  fromRaw: function (rawData) {
    if (_.isNull(rawData) || _.isUndefined(rawData)) return '';
    return this._convert(rawData);
  },

  /**
     Converts an ISO-8601 formatted datetime string to a datetime string, date
     string or a time string. The timezone is ignored if supplied. This method
     parses the input values exactly the same way as
     Backgrid.Extension.MomentFormatter#fromRaw(), in addition to doing some
     sanity checks.

     @member Backgrid.DatetimeFormatter
     @param {string} formattedData
     @return {string|undefined} ISO-8601 string in UTC. Undefined if a date is
     found when `includeDate` is false, or a time is found when `includeTime` is
     false, or if `includeDate` is true and a date is not found, or if
     `includeTime` is true and a time is not found.
  */
  toRaw: function (formattedData) {
    return this._convert(formattedData, true);
  }

});

/**
   Formatter to convert any value to string.

   @class Backgrid.StringFormatter
   @extends Backgrid.CellFormatter
   @constructor
 */
var StringFormatter = Backgrid.StringFormatter = function () {};
StringFormatter.prototype = new CellFormatter();
_.extend(StringFormatter.prototype, {
  /**
     Converts any value to a string using Ecmascript's implicit type
     conversion. If the given value is `null` or `undefined`, an empty string is
     returned instead.

     @member Backgrid.StringFormatter
     @param {*} rawValue
     @return {string}
   */
  fromRaw: function (rawValue) {
    if (_.isUndefined(rawValue) || _.isNull(rawValue)) return '';
    return rawValue + '';
  }
});

/**
   Simple email validation formatter.

   @class Backgrid.EmailFormatter
   @extends Backgrid.CellFormatter
   @constructor
 */
var EmailFormatter = Backgrid.EmailFormatter = function () {};
EmailFormatter.prototype = new CellFormatter();
_.extend(EmailFormatter.prototype, {
  /**
     Return the input if it is a string that contains an '@' character and if
     the strings before and after '@' are non-empty. If the input does not
     validate, `undefined` is returned.

     @member Backgrid.EmailFormatter
     @param {*} formattedData
     @return {string|undefined}
   */
  toRaw: function (formattedData) {
    var parts = formattedData.trim().split("@");
    if (parts.length === 2 && _.all(parts)) {
      return formattedData;
    }
  }
});

/**
   Formatter for SelectCell.

   @class Backgrid.SelectFormatter
   @extends Backgrid.CellFormatter
   @constructor
*/
var SelectFormatter = Backgrid.SelectFormatter = function () {};
SelectFormatter.prototype = new CellFormatter();
_.extend(SelectFormatter.prototype, {

  /**
     Normalizes raw scalar or array values to an array.

     @member Backgrid.SelectFormatter
     @param {*} rawValue
     @return {Array.<*>}
  */
  fromRaw: function (rawValue) {
    return _.isArray(rawValue) ? rawValue : rawValue != null ? [rawValue] : [];
  }
});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   Generic cell editor base class. Only defines an initializer for a number of
   required parameters.

   @abstract
   @class Backgrid.CellEditor
   @extends Backbone.View
*/
var CellEditor = Backgrid.CellEditor = Backbone.View.extend({

  /**
     Initializer.

     @param {Object} options
     @param {Backgrid.CellFormatter} options.formatter
     @param {Backgrid.Column} options.column
     @param {Backbone.Model} options.model

     @throws {TypeError} If `formatter` is not a formatter instance, or when
     `model` or `column` are undefined.
  */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["formatter", "column", "model"]);
    this.formatter = options.formatter;
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }

    this.listenTo(this.model, "backgrid:editing", this.postRender);
  },

  /**
     Post-rendering setup and initialization. Focuses the cell editor's `el` in
     this default implementation. **Should** be called by Cell classes after
     calling Backgrid.CellEditor#render.
  */
  postRender: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      this.$el.focus();
    }
    return this;
  }

});

/**
   InputCellEditor the cell editor type used by most core cell types. This cell
   editor renders a text input box as its editor. The input will render a
   placeholder if the value is empty on supported browsers.

   @class Backgrid.InputCellEditor
   @extends Backgrid.CellEditor
*/
var InputCellEditor = Backgrid.InputCellEditor = CellEditor.extend({

  /** @property */
  tagName: "input",

  /** @property */
  attributes: {
    type: "text"
  },

  /** @property */
  events: {
    "blur": "saveOrCancel",
    "keydown": "saveOrCancel"
  },

  /**
     Initializer. Removes this `el` from the DOM when a `done` event is
     triggered.

     @param {Object} options
     @param {Backgrid.CellFormatter} options.formatter
     @param {Backgrid.Column} options.column
     @param {Backbone.Model} options.model
     @param {string} [options.placeholder]
  */
  initialize: function (options) {
    CellEditor.prototype.initialize.apply(this, arguments);

    if (options.placeholder) {
      this.$el.attr("placeholder", options.placeholder);
    }
  },

  /**
     Renders a text input with the cell value formatted for display, if it
     exists.
  */
  render: function () {
    this.$el.val(this.formatter.fromRaw(this.model.get(this.column.get("name"))));
    return this;
  },

  /**
     If the key pressed is `enter`, `tab`, `up`, or `down`, converts the value
     in the editor to a raw value for saving into the model using the formatter.

     If the key pressed is `esc` the changes are undone.

     If the editor goes out of focus (`blur`) but the value is invalid, the
     event is intercepted and cancelled so the cell remains in focus pending for
     further action. The changes are saved otherwise.

     Triggers a Backbone `backgrid:edited` event from the model when successful,
     and `backgrid:error` if the value cannot be converted. Classes listening to
     the `error` event, usually the Cell classes, should respond appropriately,
     usually by rendering some kind of error feedback.

     @param {Event} e
  */
  saveOrCancel: function (e) {

    var formatter = this.formatter;
    var model = this.model;
    var column = this.column;

    var command = new Command(e);
    var blurred = e.type === "blur";

    if (command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
        command.save() || blurred) {

      e.preventDefault();
      e.stopPropagation();

      var val = this.$el.val();
      var newValue = formatter.toRaw(val);
      if (_.isUndefined(newValue)) {
        model.trigger("backgrid:error", model, column, val);
      }
      else {
        model.set(column.get("name"), newValue);
        model.trigger("backgrid:edited", model, column, command);
      }
    }
    // esc
    else if (command.cancel()) {
      // undo
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, command);
    }
  },

  postRender: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      // move the cursor to the end on firefox if text is right aligned
      if (this.$el.css("text-align") === "right") {
        var val = this.$el.val();
        this.$el.focus().val(null).val(val);
      }
      else this.$el.focus();
    }
    return this;
  }

});

/**
   The super-class for all Cell types. By default, this class renders a plain
   table cell with the model value converted to a string using the
   formatter. The table cell is clickable, upon which the cell will go into
   editor mode, which is rendered by a Backgrid.InputCellEditor instance by
   default. Upon encountering any formatting errors, this class will add an
   `error` CSS class to the table cell.

   @abstract
   @class Backgrid.Cell
   @extends Backbone.View
*/
var Cell = Backgrid.Cell = Backbone.View.extend({

  /** @property */
  tagName: "td",

  /**
     @property {Backgrid.CellFormatter|Object|string} [formatter=new CellFormatter()]
  */
  formatter: new CellFormatter(),

  /**
     @property {Backgrid.CellEditor} [editor=Backgrid.InputCellEditor] The
     default editor for all cell instances of this class. This value must be a
     class, it will be automatically instantiated upon entering edit mode.

     See Backgrid.CellEditor
  */
  editor: InputCellEditor,

  /** @property */
  events: {
    "click": "enterEditMode"
  },

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {ReferenceError} If formatter is a string but a formatter class of
     said name cannot be found in the Backgrid module.
  */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["model", "column"]);
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }
    this.formatter = Backgrid.resolveNameToClass(this.column.get("formatter") || this.formatter, "Formatter");
    this.editor = Backgrid.resolveNameToClass(this.editor, "CellEditor");
    this.listenTo(this.model, "change:" + this.column.get("name"), function () {
      if (!this.$el.hasClass("editor")) this.render();
    });
    this.listenTo(this.model, "backgrid:error", this.renderError);
  },

  /**
     Render a text string in a table cell. The text is converted from the
     model's raw value for this cell's column.
  */
  render: function () {
    this.$el.empty();
    this.$el.text(this.formatter.fromRaw(this.model.get(this.column.get("name"))));
    this.delegateEvents();
    return this;
  },

  /**
     If this column is editable, a new CellEditor instance is instantiated with
     its required parameters. An `editor` CSS class is added to the cell upon
     entering edit mode.

     This method triggers a Backbone `backgrid:edit` event from the model when
     the cell is entering edit mode and an editor instance has been constructed,
     but before it is rendered and inserted into the DOM. The cell and the
     constructed cell editor instance are sent as event parameters when this
     event is triggered.

     When this cell has finished switching to edit mode, a Backbone
     `backgrid:editing` event is triggered from the model. The cell and the
     constructed cell instance are also sent as parameters in the event.

     When the model triggers a `backgrid:error` event, it means the editor is
     unable to convert the current user input to an apprpriate value for the
     model's column, and an `error` CSS class is added to the cell accordingly.
  */
  enterEditMode: function () {
    var model = this.model;
    var column = this.column;

    if (column.get("editable")) {

      this.currentEditor = new this.editor({
        column: this.column,
        model: this.model,
        formatter: this.formatter
      });

      model.trigger("backgrid:edit", model, column, this, this.currentEditor);

      // Need to redundantly undelegate events for Firefox
      this.undelegateEvents();
      this.$el.empty();
      this.$el.append(this.currentEditor.$el);
      this.currentEditor.render();
      this.$el.addClass("editor");

      model.trigger("backgrid:editing", model, column, this, this.currentEditor);
    }
  },

  /**
     Put an `error` CSS class on the table cell.
  */
  renderError: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      this.$el.addClass("error");
    }
  },

  /**
     Removes the editor and re-render in display mode.
  */
  exitEditMode: function () {
    this.$el.removeClass("error");
    this.currentEditor.remove();
    this.stopListening(this.currentEditor);
    delete this.currentEditor;
    this.$el.removeClass("editor");
    this.render();
  },

  /**
     Clean up this cell.

     @chainable
  */
  remove: function () {
    if (this.currentEditor) {
      this.currentEditor.remove.apply(this, arguments);
      delete this.currentEditor;
    }
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});

/**
   StringCell displays HTML escaped strings and accepts anything typed in.

   @class Backgrid.StringCell
   @extends Backgrid.Cell
*/
var StringCell = Backgrid.StringCell = Cell.extend({

  /** @property */
  className: "string-cell",

  formatter: new StringFormatter()

});

/**
   UriCell renders an HTML `<a>` anchor for the value and accepts URIs as user
   input values. No type conversion or URL validation is done by the formatter
   of this cell. Users who need URL validation are encourage to subclass UriCell
   to take advantage of the parsing capabilities of the HTMLAnchorElement
   available on HTML5-capable browsers or using a third-party library like
   [URI.js](https://github.com/medialize/URI.js).

   @class Backgrid.UriCell
   @extends Backgrid.Cell
*/
var UriCell = Backgrid.UriCell = Cell.extend({

  /** @property */
  className: "uri-cell",

  render: function () {
    this.$el.empty();
    var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")));
    this.$el.append($("<a>", {
      tabIndex: -1,
      href: formattedValue,
      title: formattedValue,
      target: "_blank"
    }).text(formattedValue));
    this.delegateEvents();
    return this;
  }

});

/**
   Like Backgrid.UriCell, EmailCell renders an HTML `<a>` anchor for the
   value. The `href` in the anchor is prefixed with `mailto:`. EmailCell will
   complain if the user enters a string that doesn't contain the `@` sign.

   @class Backgrid.EmailCell
   @extends Backgrid.StringCell
*/
var EmailCell = Backgrid.EmailCell = StringCell.extend({

  /** @property */
  className: "email-cell",

  formatter: new EmailFormatter(),

  render: function () {
    this.$el.empty();
    var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")));
    this.$el.append($("<a>", {
      tabIndex: -1,
      href: "mailto:" + formattedValue,
      title: formattedValue
    }).text(formattedValue));
    this.delegateEvents();
    return this;
  }

});

/**
   NumberCell is a generic cell that renders all numbers. Numbers are formatted
   using a Backgrid.NumberFormatter.

   @class Backgrid.NumberCell
   @extends Backgrid.Cell
*/
var NumberCell = Backgrid.NumberCell = Cell.extend({

  /** @property */
  className: "number-cell",

  /**
     @property {number} [decimals=2] Must be an integer.
  */
  decimals: NumberFormatter.prototype.defaults.decimals,

  /** @property {string} [decimalSeparator='.'] */
  decimalSeparator: NumberFormatter.prototype.defaults.decimalSeparator,

  /** @property {string} [orderSeparator=','] */
  orderSeparator: NumberFormatter.prototype.defaults.orderSeparator,

  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.NumberFormatter] */
  formatter: NumberFormatter,

  /**
     Initializes this cell and the number formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */
  initialize: function (options) {
    Cell.prototype.initialize.apply(this, arguments);
    this.formatter = new this.formatter({
      decimals: this.decimals,
      decimalSeparator: this.decimalSeparator,
      orderSeparator: this.orderSeparator
    });
  }

});

/**
   An IntegerCell is just a Backgrid.NumberCell with 0 decimals. If a floating
   point number is supplied, the number is simply rounded the usual way when
   displayed.

   @class Backgrid.IntegerCell
   @extends Backgrid.NumberCell
*/
var IntegerCell = Backgrid.IntegerCell = NumberCell.extend({

  /** @property */
  className: "integer-cell",

  /**
     @property {number} decimals Must be an integer.
  */
  decimals: 0
});

/**
   DatetimeCell is a basic cell that accepts datetime string values in RFC-2822
   or W3C's subset of ISO-8601 and displays them in ISO-8601 format. For a much
   more sophisticated date time cell with better datetime formatting, take a
   look at the Backgrid.Extension.MomentCell extension.

   @class Backgrid.DatetimeCell
   @extends Backgrid.Cell

   See:

   - Backgrid.Extension.MomentCell
   - Backgrid.DatetimeFormatter
*/
var DatetimeCell = Backgrid.DatetimeCell = Cell.extend({

  /** @property */
  className: "datetime-cell",

  /**
     @property {boolean} [includeDate=true]
  */
  includeDate: DatetimeFormatter.prototype.defaults.includeDate,

  /**
     @property {boolean} [includeTime=true]
  */
  includeTime: DatetimeFormatter.prototype.defaults.includeTime,

  /**
     @property {boolean} [includeMilli=false]
  */
  includeMilli: DatetimeFormatter.prototype.defaults.includeMilli,

  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.DatetimeFormatter] */
  formatter: DatetimeFormatter,

  /**
     Initializes this cell and the datetime formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */
  initialize: function (options) {
    Cell.prototype.initialize.apply(this, arguments);
    this.formatter = new this.formatter({
      includeDate: this.includeDate,
      includeTime: this.includeTime,
      includeMilli: this.includeMilli
    });

    var placeholder = this.includeDate ? "YYYY-MM-DD" : "";
    placeholder += (this.includeDate && this.includeTime) ? "T" : "";
    placeholder += this.includeTime ? "HH:mm:ss" : "";
    placeholder += (this.includeTime && this.includeMilli) ? ".SSS" : "";

    this.editor = this.editor.extend({
      attributes: _.extend({}, this.editor.prototype.attributes, this.editor.attributes, {
        placeholder: placeholder
      })
    });
  }

});

/**
   DateCell is a Backgrid.DatetimeCell without the time part.

   @class Backgrid.DateCell
   @extends Backgrid.DatetimeCell
*/
var DateCell = Backgrid.DateCell = DatetimeCell.extend({

  /** @property */
  className: "date-cell",

  /** @property */
  includeTime: false

});

/**
   TimeCell is a Backgrid.DatetimeCell without the date part.

   @class Backgrid.TimeCell
   @extends Backgrid.DatetimeCell
*/
var TimeCell = Backgrid.TimeCell = DatetimeCell.extend({

  /** @property */
  className: "time-cell",

  /** @property */
  includeDate: false

});

/**
   BooleanCellEditor renders a checkbox as its editor.

   @class Backgrid.BooleanCellEditor
   @extends Backgrid.CellEditor
*/
var BooleanCellEditor = Backgrid.BooleanCellEditor = CellEditor.extend({

  /** @property */
  tagName: "input",

  /** @property */
  attributes: {
    tabIndex: -1,
    type: "checkbox"
  },

  /** @property */
  events: {
    "mousedown": function () {
      this.mouseDown = true;
    },
    "blur": "enterOrExitEditMode",
    "mouseup": function () {
      this.mouseDown = false;
    },
    "change": "saveOrCancel",
    "keydown": "saveOrCancel"
  },

  /**
     Renders a checkbox and check it if the model value of this column is true,
     uncheck otherwise.
  */
  render: function () {
    var val = this.formatter.fromRaw(this.model.get(this.column.get("name")));
    this.$el.prop("checked", val);
    return this;
  },

  /**
     Event handler. Hack to deal with the case where `blur` is fired before
     `change` and `click` on a checkbox.
  */
  enterOrExitEditMode: function (e) {
    if (!this.mouseDown) {
      var model = this.model;
      model.trigger("backgrid:edited", model, this.column, new Command(e));
    }
  },

  /**
     Event handler. Save the value into the model if the event is `change` or
     one of the keyboard navigation key presses. Exit edit mode without saving
     if `escape` was pressed.
  */
  saveOrCancel: function (e) {
    var model = this.model;
    var column = this.column;
    var formatter = this.formatter;
    var command = new Command(e);
    // skip ahead to `change` when space is pressed
    if (command.passThru() && e.type != "change") return true;
    if (command.cancel()) {
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, command);
    }

    var $el = this.$el;
    if (command.save() || command.moveLeft() || command.moveRight() || command.moveUp() ||
        command.moveDown()) {
      e.preventDefault();
      e.stopPropagation();
      var val = formatter.toRaw($el.prop("checked"));
      model.set(column.get("name"), val);
      model.trigger("backgrid:edited", model, column, command);
    }
    else if (e.type == "change") {
      var val = formatter.toRaw($el.prop("checked"));
      model.set(column.get("name"), val);
      $el.focus();
    }
  }

});

/**
   BooleanCell renders a checkbox both during display mode and edit mode. The
   checkbox is checked if the model value is true, unchecked otherwise.

   @class Backgrid.BooleanCell
   @extends Backgrid.Cell
*/
var BooleanCell = Backgrid.BooleanCell = Cell.extend({

  /** @property */
  className: "boolean-cell",

  /** @property */
  editor: BooleanCellEditor,

  /** @property */
  events: {
    "click": "enterEditMode"
  },

  /**
     Renders a checkbox and check it if the model value of this column is true,
     uncheck otherwise.
  */
  render: function () {
    this.$el.empty();
    this.$el.append($("<input>", {
      tabIndex: -1,
      type: "checkbox",
      checked: this.formatter.fromRaw(this.model.get(this.column.get("name")))
    }));
    this.delegateEvents();
    return this;
  }

});

/**
   SelectCellEditor renders an HTML `<select>` fragment as the editor.

   @class Backgrid.SelectCellEditor
   @extends Backgrid.CellEditor
*/
var SelectCellEditor = Backgrid.SelectCellEditor = CellEditor.extend({

  /** @property */
  tagName: "select",

  /** @property */
  events: {
    "change": "save",
    "blur": "close",
    "keydown": "close"
  },

  /** @property {function(Object, ?Object=): string} template */
  template: _.template('<option value="<%- value %>" <%= selected ? \'selected="selected"\' : "" %>><%- text %></option>'),

  setOptionValues: function (optionValues) {
    this.optionValues = optionValues;
  },

  setMultiple: function (multiple) {
    this.multiple = multiple;
    this.$el.prop("multiple", multiple);
  },

  _renderOptions: function (nvps, selectedValues) {
    var options = '';
    for (var i = 0; i < nvps.length; i++) {
      options = options + this.template({
        text: nvps[i][0],
        value: nvps[i][1],
        selected: selectedValues.indexOf(nvps[i][1]) > -1
      });
    }
    return options;
  },

  /**
     Renders the options if `optionValues` is a list of name-value pairs. The
     options are contained inside option groups if `optionValues` is a list of
     object hashes. The name is rendered at the option text and the value is the
     option value. If `optionValues` is a function, it is called without a
     parameter.
  */
  render: function () {
    this.$el.empty();

    var optionValues = _.result(this, "optionValues");
    var selectedValues = this.formatter.fromRaw(this.model.get(this.column.get("name")));

    if (!_.isArray(optionValues)) throw TypeError("optionValues must be an array");

    var optionValue = null;
    var optionText = null;
    var optionValue = null;
    var optgroupName = null;
    var optgroup = null;

    for (var i = 0; i < optionValues.length; i++) {
      var optionValue = optionValues[i];

      if (_.isArray(optionValue)) {
        optionText  = optionValue[0];
        optionValue = optionValue[1];

        this.$el.append(this.template({
          text: optionText,
          value: optionValue,
          selected: selectedValues.indexOf(optionValue) > -1
        }));
      }
      else if (_.isObject(optionValue)) {
        optgroupName = optionValue.name;
        optgroup = $("<optgroup></optgroup>", { label: optgroupName });
        optgroup.append(this._renderOptions(optionValue.values, selectedValues));
        this.$el.append(optgroup);
      }
      else {
        throw TypeError("optionValues elements must be a name-value pair or an object hash of { name: 'optgroup label', value: [option name-value pairs] }");
      }
    }

    this.delegateEvents();

    return this;
  },

  /**
     Saves the value of the selected option to the model attribute. Triggers a
     `backgrid:edited` Backbone event from the model.
  */
  save: function (e) {
    var model = this.model;
    var column = this.column;
    model.set(column.get("name"), this.formatter.toRaw(this.$el.val()));
    model.trigger("backgrid:edited", model, column, new Command(e));
  },

  /**
     Triggers a `backgrid:edited` event from the model so the body can close
     this editor.
  */
  close: function (e) {
    var model = this.model;
    var column = this.column;
    var command = new Command(e);
    if (command.cancel()) {
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, new Command(e));
    }
    else if (command.save() || command.moveLeft() || command.moveRight() ||
             command.moveUp() || command.moveDown() || e.type == "blur") {
      e.preventDefault();
      e.stopPropagation();
      if (e.type == "blur" && this.$el.find("option").length === 1) {
        model.set(column.get("name"), this.formatter.toRaw(this.$el.val()));
      }
      model.trigger("backgrid:edited", model, column, new Command(e));
    }
  }

});

/**
   SelectCell is also a different kind of cell in that upon going into edit mode
   the cell renders a list of options to pick from, as opposed to an input box.

   SelectCell cannot be referenced by its string name when used in a column
   definition because it requires an `optionValues` class attribute to be
   defined. `optionValues` can either be a list of name-value pairs, to be
   rendered as options, or a list of object hashes which consist of a key *name*
   which is the option group name, and a key *values* which is a list of
   name-value pairs to be rendered as options under that option group.

   In addition, `optionValues` can also be a parameter-less function that
   returns one of the above. If the options are static, it is recommended the
   returned values to be memoized. `_.memoize()` is a good function to help with
   that.

   During display mode, the default formatter will normalize the raw model value
   to an array of values whether the raw model value is a scalar or an
   array. Each value is compared with the `optionValues` values using
   Ecmascript's implicit type conversion rules. When exiting edit mode, no type
   conversion is performed when saving into the model. This behavior is not
   always desirable when the value type is anything other than string. To
   control type conversion on the client-side, you should subclass SelectCell to
   provide a custom formatter or provide the formatter to your column
   definition.

   See:
     [$.fn.val()](http://api.jquery.com/val/)

   @class Backgrid.SelectCell
   @extends Backgrid.Cell
*/
var SelectCell = Backgrid.SelectCell = Cell.extend({

  /** @property */
  className: "select-cell",

  /** @property */
  editor: SelectCellEditor,

  /** @property */
  multiple: false,

  /** @property */
  formatter: new SelectFormatter(),

  /**
     @property {Array.<Array>|Array.<{name: string, values: Array.<Array>}>} optionValues
  */
  optionValues: undefined,

  /** @property */
  delimiter: ', ',

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {TypeError} If `optionsValues` is undefined.
  */
  initialize: function (options) {
    Cell.prototype.initialize.apply(this, arguments);
    Backgrid.requireOptions(this, ["optionValues"]);
    this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
      if (column.get("name") == this.column.get("name")) {
        editor.setOptionValues(this.optionValues);
        editor.setMultiple(this.multiple);
      }
    });
  },

  /**
     Renders the label using the raw value as key to look up from `optionValues`.

     @throws {TypeError} If `optionValues` is malformed.
  */
  render: function () {
    this.$el.empty();

    var optionValues = this.optionValues;
    var rawData = this.formatter.fromRaw(this.model.get(this.column.get("name")));

    var selectedText = [];

    try {
      if (!_.isArray(optionValues) || _.isEmpty(optionValues)) throw new TypeError;

      for (var k = 0; k < rawData.length; k++) {
        var rawDatum = rawData[k];

        for (var i = 0; i < optionValues.length; i++) {
          var optionValue = optionValues[i];

          if (_.isArray(optionValue)) {
            var optionText  = optionValue[0];
            var optionValue = optionValue[1];

            if (optionValue == rawDatum) selectedText.push(optionText);
          }
          else if (_.isObject(optionValue)) {
            var optionGroupValues = optionValue.values;

            for (var j = 0; j < optionGroupValues.length; j++) {
              var optionGroupValue = optionGroupValues[j];
              if (optionGroupValue[1] == rawDatum) {
                selectedText.push(optionGroupValue[0]);
              }
            }
          }
          else {
            throw new TypeError;
          }
        }
      }

      this.$el.append(selectedText.join(this.delimiter));
    }
    catch (ex) {
      if (ex instanceof TypeError) {
        throw TypeError("'optionValues' must be of type {Array.<Array>|Array.<{name: string, values: Array.<Array>}>}");
      }
      throw ex;
    }

    this.delegateEvents();

    return this;
  }

});
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   A Column is a placeholder for column metadata.

   You usually don't need to create an instance of this class yourself as a
   collection of column instances will be created for you from a list of column
   attributes in the Backgrid.js view class constructors.

   @class Backgrid.Column
   @extends Backbone.Model
 */
var Column = Backgrid.Column = Backbone.Model.extend({

  defaults: {
    name: undefined,
    label: undefined,
    sortable: true,
    editable: true,
    renderable: true,
    formatter: undefined,
    cell: undefined,
    headerCell: undefined
  },

  /**
     Initializes this Column instance.

     @param {Object} attrs Column attributes.
     @param {string} attrs.name The name of the model attribute.
     @param {string|Backgrid.Cell} attrs.cell The cell type.
     If this is a string, the capitalized form will be used to look up a
     cell class in Backbone, i.e.: string => StringCell. If a Cell subclass
     is supplied, it is initialized with a hash of parameters. If a Cell
     instance is supplied, it is used directly.
     @param {string|Backgrid.HeaderCell} [attrs.headerCell] The header cell type.
     @param {string} [attrs.label] The label to show in the header.
     @param {boolean} [attrs.sortable=true]
     @param {boolean} [attrs.editable=true]
     @param {boolean} [attrs.renderable=true]
     @param {Backgrid.CellFormatter|Object|string} [attrs.formatter] The
     formatter to use to convert between raw model values and user input.

     @throws {TypeError} If attrs.cell or attrs.options are not supplied.
     @throws {ReferenceError} If attrs.cell is a string but a cell class of
     said name cannot be found in the Backgrid module.

     See:

     - Backgrid.Cell
     - Backgrid.CellFormatter
   */
  initialize: function (attrs) {
    Backgrid.requireOptions(attrs, ["cell", "name"]);

    if (!this.has("label")) {
      this.set({ label: this.get("name") }, { silent: true });
    }

    var headerCell = Backgrid.resolveNameToClass(this.get("headerCell"), "HeaderCell");
    var cell = Backgrid.resolveNameToClass(this.get("cell"), "Cell");
    this.set({ cell: cell, headerCell: headerCell }, { silent: true });
  }

});

/**
   A Backbone collection of Column instances.

   @class Backgrid.Columns
   @extends Backbone.Collection
 */
var Columns = Backgrid.Columns = Backbone.Collection.extend({

  /**
     @property {Backgrid.Column} model
   */
  model: Column
});
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   Row is a simple container view that takes a model instance and a list of
   column metadata describing how each of the model's attribute is to be
   rendered, and apply the appropriate cell to each attribute.

   @class Backgrid.Row
   @extends Backbone.View
*/
var Row = Backgrid.Row = Backbone.View.extend({

  /** @property */
  tagName: "tr",

  requiredOptions: ["columns", "model"],

  /**
     Initializes a row view instance.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Model} options.model The model instance to render.

     @throws {TypeError} If options.columns or options.model is undefined.
  */
  initialize: function (options) {

    Backgrid.requireOptions(options, this.requiredOptions);

    var columns = this.columns = options.columns;
    if (!(columns instanceof Backbone.Collection)) {
      columns = this.columns = new Columns(columns);
    }

    var cells = this.cells = [];
    for (var i = 0; i < columns.length; i++) {
      cells.push(this.makeCell(columns.at(i), options));
    }

    this.listenTo(columns, "change:renderable", function (column, renderable) {
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.column.get("name") == column.get("name")) {
          if (renderable) cell.$el.show(); else cell.$el.hide();
        }
      }
    });

    this.listenTo(columns, "add", function (column, columns) {
      var i = columns.indexOf(column);
      var cell = this.makeCell(column, options);
      cells.splice(i, 0, cell);

      if (!cell.column.get("renderable")) cell.$el.hide();

      var $el = this.$el;
      if (i === 0) {
        $el.prepend(cell.render().$el);
      }
      else if (i === columns.length - 1) {
        $el.append(cell.render().$el);
      }
      else {
        $el.children().eq(i).before(cell.render().$el);
      }
    });

    this.listenTo(columns, "remove", function (column, columns, opts) {
      cells[opts.index].remove();
      cells.splice(opts.index, 1);
    });
  },

  /**
     Factory method for making a cell. Used by #initialize internally. Override
     this to provide an appropriate cell instance for a custom Row subclass.

     @protected

     @param {Backgrid.Column} column
     @param {Object} options The options passed to #initialize.

     @return {Backgrid.Cell}
  */
  makeCell: function (column) {
    return new (column.get("cell"))({
      column: column,
      model: this.model
    });
  },

  /**
     Renders a row of cells for this row's model.
  */
  render: function () {
    this.$el.empty();

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      fragment.appendChild(cell.render().el);
      if (!cell.column.get("renderable")) cell.$el.hide();
    }

    this.el.appendChild(fragment);

    this.delegateEvents();

    return this;
  },

  /**
     Clean up this row and its cells.

     @chainable
  */
  remove: function () {
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      cell.remove.apply(cell, arguments);
    }
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});

/**
   EmptyRow is a simple container view that takes a list of column and render a
   row with a single column.

   @class Backgrid.EmptyRow
   @extends Backbone.View
*/
var EmptyRow = Backgrid.EmptyRow = Backbone.View.extend({

  /** @property */
  tagName: "tr",

  /** @property */
  emptyText: null,

  /**
     Initializer.

     @param {Object} options
     @param {string} options.emptyText
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
   */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["emptyText", "columns"]);

    this.emptyText = options.emptyText;
    this.columns =  options.columns;
  },

  /**
     Renders an empty row.
  */
  render: function () {
    this.$el.empty();

    var td = document.createElement("td");
    td.setAttribute("colspan", this.columns.length);
    td.textContent = this.emptyText;

    this.el.setAttribute("class", "empty");
    this.el.appendChild(td);

    return this;
  }
});
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   HeaderCell is a special cell class that renders a column header cell. If the
   column is sortable, a sorter is also rendered and will trigger a table
   refresh after sorting.

   @class Backgrid.HeaderCell
   @extends Backbone.View
 */
var HeaderCell = Backgrid.HeaderCell = Backbone.View.extend({

  /** @property */
  tagName: "th",

  /** @property */
  events: {
    "click a": "onClick"
  },

  /**
    @property {null|"ascending"|"descending"} _direction The current sorting
    direction of this column.
  */
  _direction: null,

  /**
     Initializer.

     @param {Object} options
     @param {Backgrid.Column|Object} options.column

     @throws {TypeError} If options.column or options.collection is undefined.
   */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["column", "collection"]);
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }
    this.listenTo(this.collection, "backgrid:sort", this._resetCellDirection);
  },

  /**
     Gets or sets the direction of this cell. If called directly without
     parameters, returns the current direction of this cell, otherwise sets
     it. If a `null` is given, sets this cell back to the default order.

     @param {null|"ascending"|"descending"} dir
     @return {null|string} The current direction or the changed direction.
   */
  direction: function (dir) {
    if (arguments.length) {
      if (this._direction) this.$el.removeClass(this._direction);
      if (dir) this.$el.addClass(dir);
      this._direction = dir;
    }

    return this._direction;
  },

  /**
     Event handler for the Backbone `backgrid:sort` event. Resets this cell's
     direction to default if sorting is being done on another column.

     @private
   */
  _resetCellDirection: function (sortByColName, direction, comparator, collection) {
    if (collection == this.collection) {
      if (sortByColName !== this.column.get("name")) this.direction(null);
      else this.direction(direction);
    }
  },

  /**
     Event handler for the `click` event on the cell's anchor. If the column is
     sortable, clicking on the anchor will cycle through 3 sorting orderings -
     `ascending`, `descending`, and default.
   */
  onClick: function (e) {
    e.preventDefault();

    var columnName = this.column.get("name");

    if (this.column.get("sortable")) {
      if (this.direction() === "ascending") {
        this.sort(columnName, "descending", function (left, right) {
          var leftVal = left.get(columnName);
          var rightVal = right.get(columnName);
          if (leftVal === rightVal) {
            return 0;
          }
          else if (leftVal > rightVal) { return -1; }
          return 1;
        });
      }
      else if (this.direction() === "descending") {
        this.sort(columnName, null);
      }
      else {
        this.sort(columnName, "ascending", function (left, right) {
          var leftVal = left.get(columnName);
          var rightVal = right.get(columnName);
          if (leftVal === rightVal) {
            return 0;
          }
          else if (leftVal < rightVal) { return -1; }
          return 1;
        });
      }
    }
  },

  /**
     If the underlying collection is a Backbone.PageableCollection in
     server-mode or infinite-mode, a page of models is fetched after sorting is
     done on the server.

     If the underlying collection is a Backbone.PageableCollection in
     client-mode, or any
     [Backbone.Collection](http://backbonejs.org/#Collection) instance, sorting
     is done on the client side. If the collection is an instance of a
     Backbone.PageableCollection, sorting will be done globally on all the pages
     and the current page will then be returned.

     Triggers a Backbone `backgrid:sort` event from the collection when done
     with the column name, direction, comparator and a reference to the
     collection.

     @param {string} columnName
     @param {null|"ascending"|"descending"} direction
     @param {function(*, *): number} [comparator]

     See [Backbone.Collection#comparator](http://backbonejs.org/#Collection-comparator)
  */
  sort: function (columnName, direction, comparator) {

    comparator = comparator || this._cidComparator;

    var collection = this.collection;

    if (Backbone.PageableCollection && collection instanceof Backbone.PageableCollection) {
      var order;
      if (direction === "ascending") order = -1;
      else if (direction === "descending") order = 1;
      else order = null;

      collection.setSorting(order ? columnName : null, order);

      if (collection.mode == "client") {
        if (!collection.fullCollection.comparator) {
          collection.fullCollection.comparator = comparator;
        }
        collection.fullCollection.sort();
      }
      else collection.fetch({reset: true});
    }
    else {
      collection.comparator = comparator;
      collection.sort();
    }

    this.collection.trigger("backgrid:sort", columnName, direction, comparator, this.collection);
  },

  /**
     Default comparator for Backbone.Collections. Sorts cids in ascending
     order. The cids of the models are assumed to be in insertion order.

     @private
     @param {*} left
     @param {*} right
  */
  _cidComparator: function (left, right) {
    var lcid = left.cid, rcid = right.cid;
    if (!_.isUndefined(lcid) && !_.isUndefined(rcid)) {
      lcid = lcid.slice(1) * 1, rcid = rcid.slice(1) * 1;
      if (lcid < rcid) return -1;
      else if (lcid > rcid) return 1;
    }

    return 0;
  },

  /**
     Renders a header cell with a sorter and a label.
   */
  render: function () {
    this.$el.empty();
    var $label = $("<a>").text(this.column.get("label")).append("<b class='sort-caret'></b>");
    this.$el.append($label);
    this.delegateEvents();
    return this;
  }

});

/**
   HeaderRow is a controller for a row of header cells.

   @class Backgrid.HeaderRow
   @extends Backgrid.Row
 */
var HeaderRow = Backgrid.HeaderRow = Backgrid.Row.extend({

  requiredOptions: ["columns", "collection"],

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     @param {Backgrid.HeaderCell} [options.headerCell] Customized default
     HeaderCell for all the columns. Supply a HeaderCell class or instance to a
     the `headerCell` key in a column definition for column-specific header
     rendering.

     @throws {TypeError} If options.columns or options.collection is undefined.
   */
  initialize: function () {
    Backgrid.Row.prototype.initialize.apply(this, arguments);
  },

  makeCell: function (column, options) {
    var headerCell = column.get("headerCell") || options.headerCell || HeaderCell;
    headerCell = new headerCell({
      column: column,
      collection: this.collection
    });
    return headerCell;
  }

});

/**
   Header is a special structural view class that renders a table head with a
   single row of header cells.

   @class Backgrid.Header
   @extends Backbone.View
 */
var Header = Backgrid.Header = Backbone.View.extend({

  /** @property */
  tagName: "thead",

  /**
     Initializer. Initializes this table head view to contain a single header
     row view.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Model} options.model The model instance to render.

     @throws {TypeError} If options.columns or options.model is undefined.
   */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["columns", "collection"]);

    this.columns = options.columns;
    if (!(this.columns instanceof Backbone.Collection)) {
      this.columns = new Columns(this.columns);
    }

    this.row = new Backgrid.HeaderRow({
      columns: this.columns,
      collection: this.collection
    });
  },

  /**
     Renders this table head with a single row of header cells.
   */
  render: function () {
    this.$el.append(this.row.render().$el);
    this.delegateEvents();
    return this;
  },

  /**
     Clean up this header and its row.

     @chainable
   */
  remove: function () {
    this.row.remove.apply(this.row, arguments);
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   Body is the table body which contains the rows inside a table. Body is
   responsible for refreshing the rows after sorting, insertion and removal.

   @class Backgrid.Body
   @extends Backbone.View
*/
var Body = Backgrid.Body = Backbone.View.extend({

  /** @property */
  tagName: "tbody",

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection} options.collection
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     Column metadata.
     @param {Backgrid.Row} [options.row=Backgrid.Row] The Row class to use.
     @param {string} [options.emptyText] The text to display in the empty row.

     @throws {TypeError} If options.columns or options.collection is undefined.

     See Backgrid.Row.
  */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["columns", "collection"]);

    this.columns = options.columns;
    if (!(this.columns instanceof Backbone.Collection)) {
      this.columns = new Columns(this.columns);
    }

    this.row = options.row || Row;
    this.rows = this.collection.map(function (model) {
      var row = new this.row({
        columns: this.columns,
        model: model
      });

      return row;
    }, this);

    this.emptyText = options.emptyText;
    this._unshiftEmptyRowMayBe();

    var collection = this.collection;
    this.listenTo(collection, "add", this.insertRow);
    this.listenTo(collection, "remove", this.removeRow);
    this.listenTo(collection, "sort", this.refresh);
    this.listenTo(collection, "reset", this.refresh);
    this.listenTo(collection, "backgrid:edited", this.moveToNextCell);
  },

  _unshiftEmptyRowMayBe: function () {
    if (this.rows.length === 0 && this.emptyText != null) {
      this.rows.unshift(new EmptyRow({
        emptyText: this.emptyText,
        columns: this.columns
      }));
    }
  },

  /**
     This method can be called either directly or as a callback to a
     [Backbone.Collecton#add](http://backbonejs.org/#Collection-add) event.

     When called directly, it accepts a model or an array of models and an
     option hash just like
     [Backbone.Collection#add](http://backbonejs.org/#Collection-add) and
     delegates to it. Once the model is added, a new row is inserted into the
     body and automatically rendered.

     When called as a callback of an `add` event, splices a new row into the
     body and renders it.

     @param {Backbone.Model} model The model to render as a row.
     @param {Backbone.Collection} collection When called directly, this
     parameter is actually the options to
     [Backbone.Collection#add](http://backbonejs.org/#Collection-add).
     @param {Object} options When called directly, this must be null.

     See:

     - [Backbone.Collection#add](http://backbonejs.org/#Collection-add)
  */
  insertRow: function (model, collection, options) {

    if (this.rows[0] instanceof EmptyRow) this.rows.pop().remove();

    // insertRow() is called directly
    if (!(collection instanceof Backbone.Collection) && !options) {
      this.collection.add(model, (options = collection));
      return;
    }

    options = _.extend({render: true}, options || {});

    var row = new this.row({
      columns: this.columns,
      model: model
    });

    var index = collection.indexOf(model);
    this.rows.splice(index, 0, row);

    var $el = this.$el;
    var $children = $el.children();
    var $rowEl = row.render().$el;

    if (options.render) {
      if (index >= $children.length) {
        $el.append($rowEl);
      }
      else {
        $children.eq(index).before($rowEl);
      }
    }
  },

  /**
     The method can be called either directly or as a callback to a
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
     event.

     When called directly, it accepts a model or an array of models and an
     option hash just like
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove) and
     delegates to it. Once the model is removed, a corresponding row is removed
     from the body.

     When called as a callback of a `remove` event, splices into the rows and
     removes the row responsible for rendering the model.

     @param {Backbone.Model} model The model to remove from the body.
     @param {Backbone.Collection} collection When called directly, this
     parameter is actually the options to
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove).
     @param {Object} options When called directly, this must be null.

     See:

     - [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
  */
  removeRow: function (model, collection, options) {

    // removeRow() is called directly
    if (!options) {
      this.collection.remove(model, (options = collection));
      this._unshiftEmptyRowMayBe();
      return;
    }

    if (_.isUndefined(options.render) || options.render) {
      this.rows[options.index].remove();
    }

    this.rows.splice(options.index, 1);
    this._unshiftEmptyRowMayBe();
  },

  /**
     Reinitialize all the rows inside the body and re-render them. Triggers a
     Backbone `backgrid:refresh` event from the collection along with the body
     instance as its sole parameter when done.
  */
  refresh: function () {
    for (var i = 0; i < this.rows.length; i++) {
      this.rows[i].remove();
    }

    this.rows = this.collection.map(function (model) {
      var row = new this.row({
        columns: this.columns,
        model: model
      });

      return row;
    }, this);
    this._unshiftEmptyRowMayBe();

    this.render();

    this.collection.trigger("backgrid:refresh", this);

    return this;
  },

  /**
     Renders all the rows inside this body. If the collection is empty and
     `options.emptyText` is defined and not null in the constructor, an empty
     row is rendered, otherwise no row is rendered.
  */
  render: function () {
    this.$el.empty();

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      fragment.appendChild(row.render().el);
    }

    this.el.appendChild(fragment);

    this.delegateEvents();

    return this;
  },

  /**
     Clean up this body and it's rows.

     @chainable
  */
  remove: function () {
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      row.remove.apply(row, arguments);
    }
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  /**
     Moves focus to the next renderable and editable cell and return the
     currently editing cell to display mode.

     @param {Backbone.Model} model The originating model
     @param {Backgrid.Column} column The originating model column
     @param {Backgrid.Command} command The Command object constructed from a DOM
     Event
  */
  moveToNextCell: function (model, column, command) {
    var i = this.collection.indexOf(model);
    var j = this.columns.indexOf(column);

    if (command.moveUp() || command.moveDown() || command.moveLeft() ||
        command.moveRight() || command.save()) {
      var l = this.columns.length;
      var maxOffset = l * this.collection.length;

      if (command.moveUp() || command.moveDown()) {
        var row = this.rows[i + (command.moveUp() ? -1 : 1)];
        if (row) row.cells[j].enterEditMode();
      }
      else if (command.moveLeft() || command.moveRight()) {
        var right = command.moveRight();
        for (var offset = i * l + j + (right ? 1 : -1);
             offset >= 0 && offset < maxOffset;
             right ? offset++ : offset--) {
          var m = ~~(offset / l);
          var n = offset - m * l;
          var cell = this.rows[m].cells[n];
          if (cell.column.get("renderable") && cell.column.get("editable")) {
            cell.enterEditMode();
            break;
          }
        }
      }
    }

    this.rows[i].cells[j].exitEditMode();
  }
});
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   A Footer is a generic class that only defines a default tag `tfoot` and
   number of required parameters in the initializer.

   @abstract
   @class Backgrid.Footer
   @extends Backbone.View
 */
var Footer = Backgrid.Footer = Backbone.View.extend({

  /** @property */
  tagName: "tfoot",

  /**
     Initializer.

     @param {Object} options
     @param {*} options.parent The parent view class of this footer.
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     Column metadata.
     @param {Backbone.Collection} options.collection

     @throws {TypeError} If options.columns or options.collection is undefined.
  */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["columns", "collection"]);
    this.columns = options.columns;
    if (!(this.columns instanceof Backbone.Collection)) {
      this.columns = new Backgrid.Columns(this.columns);
    }
  }

});
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

/**
   Grid represents a data grid that has a header, body and an optional footer.

   By default, a Grid treats each model in a collection as a row, and each
   attribute in a model as a column. To render a grid you must provide a list of
   column metadata and a collection to the Grid constructor. Just like any
   Backbone.View class, the grid is rendered as a DOM node fragment when you
   call render().

       var grid = Backgrid.Grid({
         columns: [{ name: "id", label: "ID", type: "string" },
          // ...
         ],
         collections: books
       });

       $("#table-container").append(grid.render().el);

   Optionally, if you want to customize the rendering of the grid's header and
   footer, you may choose to extend Backgrid.Header and Backgrid.Footer, and
   then supply that class or an instance of that class to the Grid constructor.
   See the documentation for Header and Footer for further details.

       var grid = Backgrid.Grid({
         columns: [{ name: "id", label: "ID", type: "string" }],
         collections: books,
         header: Backgrid.Header.extend({
              //...
         }),
         footer: Backgrid.Paginator
       });

   Finally, if you want to override how the rows are rendered in the table body,
   you can supply a Body subclass as the `body` attribute that uses a different
   Row class.

   @class Backgrid.Grid
   @extends Backbone.View

   See:

   - Backgrid.Column
   - Backgrid.Header
   - Backgrid.Body
   - Backgrid.Row
   - Backgrid.Footer
*/
var Grid = Backgrid.Grid = Backbone.View.extend({

  /** @property */
  tagName: "table",

  /** @property */
  className: "backgrid",

  /** @property */
  header: Header,

  /** @property */
  body: Body,

  /** @property */
  footer: null,

  /**
     Initializes a Grid instance.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Collection} options.collection The collection of tabular model data to display.
     @param {Backgrid.Header} [options.header=Backgrid.Header] An optional Header class to override the default.
     @param {Backgrid.Body} [options.body=Backgrid.Body] An optional Body class to override the default.
     @param {Backgrid.Row} [options.row=Backgrid.Row] An optional Row class to override the default.
     @param {Backgrid.Footer} [options.footer=Backgrid.Footer] An optional Footer class.
   */
  initialize: function (options) {
    Backgrid.requireOptions(options, ["columns", "collection"]);

    // Convert the list of column objects here first so the subviews don't have
    // to.
    if (!(options.columns instanceof Backbone.Collection)) {
      options.columns = new Columns(options.columns);
    }
    this.columns = options.columns;

    var passedThruOptions = _.omit(options, ["el", "id", "attributes",
                                             "className", "tagName", "events"]);

    this.header = options.header || this.header;
    this.header = new this.header(passedThruOptions);

    this.body = options.body || this.body;
    this.body = new this.body(passedThruOptions);

    this.footer = options.footer || this.footer;
    if (this.footer) {
      this.footer = new this.footer(passedThruOptions);
    }

    this.listenTo(this.columns, "reset", function () {
      this.header = new (this.header.remove().constructor)(passedThruOptions);
      this.body = new (this.body.remove().constructor)(passedThruOptions);
      if (this.footer) {
        this.footer = new (this.footer.remove().constructor)(passedThruOptions);
      }
      this.render();
    });
  },

  /**
     Delegates to Backgrid.Body#insertRow.
   */
  insertRow: function (model, collection, options) {
    return this.body.insertRow(model, collection, options);
  },

  /**
     Delegates to Backgrid.Body#removeRow.
   */
  removeRow: function (model, collection, options) {
    return this.body.removeRow(model, collection, options);
  },

  /**
     Delegates to Backgrid.Columns#add for adding a column. Subviews can listen
     to the `add` event from their internal `columns` if rerendering needs to
     happen.

     @param {Object} [options] Options for `Backgrid.Columns#add`.
     @param {boolean} [options.render=true] Whether to render the column
     immediately after insertion.

     @chainable
   */
  insertColumn: function (column, options) {
    options = options || {render: true};
    this.columns.add(column, options);
    return this;
  },

  /**
     Delegates to Backgrid.Columns#remove for removing a column. Subviews can
     listen to the `remove` event from the internal `columns` if rerendering
     needs to happen.

     @param {Object} [options] Options for `Backgrid.Columns#remove`.

     @chainable
   */
  removeColumn: function (column, options) {
    this.columns.remove(column, options);
    return this;
  },

  /**
     Renders the grid's header, then footer, then finally the body. Triggers a
     Backbone `backgrid:rendered` event along with a reference to the grid when
     the it has successfully been rendered.
   */
  render: function () {
    this.$el.empty();

    this.$el.append(this.header.render().$el);

    if (this.footer) {
      this.$el.append(this.footer.render().$el);
    }

    this.$el.append(this.body.render().$el);

    this.delegateEvents();

    this.trigger("backgrid:rendered", this);

    return this;
  },

  /**
     Clean up this grid and its subviews.

     @chainable
   */
  remove: function () {
    this.header.remove.apply(this.header, arguments);
    this.body.remove.apply(this.body, arguments);
    this.footer && this.footer.remove.apply(this.footer, arguments);
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});

}(this, jQuery, _, Backbone));
define("Backgrid", ["backbone"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Backgrid;
    };
}(this)));

/**
 * Created by osavch on 27.11.13.
 */
define('src/js/gridTemplates/TerritoriesGridColumns',['Backgrid'], function (Backgrid) {
    return [
        {
            name: "id", // The key of the model attribute
            label: "ID", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            })
        },
        {
            name: "name",
            label: "Name",
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
        },
        {
            name: "pop",
            label: "Population",
            cell: "integer" // An integer cell is a number cell that displays humanized integers
        },
        {
            name: "percentage",
            label: "% of World Population",
            cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
        },
        {
            name: "date",
            label: "Date",
            cell: "date",
        },
        {
            name: "url",
            label: "URL",
            cell: "uri" // Renders the value in an HTML anchor element
        }
    ];
});
/*
  backgrid-paginator
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

(function ($, _, Backbone, Backgrid) {

  "use strict";

  /**
     Paginator is a Backgrid extension that renders a series of configurable
     pagination handles. This extension is best used for splitting a large data
     set across multiple pages. If the number of pages is larger then a
     threshold, which is set to 10 by default, the page handles are rendered
     within a sliding window, plus the fast forward, fast backward, previous and
     next page handles. The fast forward, fast backward, previous and next page
     handles can be turned off.

     @class Backgrid.Extension.Paginator
  */
  Backgrid.Extension.Paginator = Backbone.View.extend({

    /** @property */
    className: "backgrid-paginator",

    /** @property */
    windowSize: 10,

    /**
       @property {Object} fastForwardHandleLabels You can disable specific
       handles by setting its value to `null`.
    */
    fastForwardHandleLabels: {
      first: "《",
      prev: "〈",
      next: "〉",
      last: "》"
    },

    /** @property */
    template: _.template('<ul><% _.each(handles, function (handle) { %><li <% if (handle.className) { %>class="<%= handle.className %>"<% } %>><a href="#" <% if (handle.title) {%> title="<%= handle.title %>"<% } %>><%= handle.label %></a></li><% }); %></ul>'),

    /** @property */
    events: {
      "click a": "changePage"
    },

    /**
       Initializer.

       @param {Object} options
       @param {Backbone.Collection} options.collection
       @param {boolean} [options.fastForwardHandleLabels] Whether to render fast forward buttons.
    */
    initialize: function (options) {
      Backgrid.requireOptions(options, ["collection"]);

      var collection = this.collection;
      var fullCollection = collection.fullCollection;
      if (fullCollection) {
        this.listenTo(fullCollection, "add", this.render);
        this.listenTo(fullCollection, "remove", this.render);
        this.listenTo(fullCollection, "reset", this.render);
      }
      else {
        this.listenTo(collection, "add", this.render);
        this.listenTo(collection, "remove", this.render);
        this.listenTo(collection, "reset", this.render);
      }
    },

    /**
       jQuery event handler for the page handlers. Goes to the right page upon
       clicking.

       @param {Event} e
     */
    changePage: function (e) {
      e.preventDefault();

      var $li = $(e.target).parent();
      if (!$li.hasClass("active") && !$li.hasClass("disabled")) {

        var label = $(e.target).text();
        var ffLabels = this.fastForwardHandleLabels;

        var collection = this.collection;

        if (ffLabels) {
          switch (label) {
          case ffLabels.first:
            collection.getFirstPage();
            return;
          case ffLabels.prev:
            collection.getPreviousPage();
            return;
          case ffLabels.next:
            collection.getNextPage();
            return;
          case ffLabels.last:
            collection.getLastPage();
            return;
          }
        }

        var state = collection.state;
        var pageIndex = +label;
        collection.getPage(state.firstPage === 0 ? pageIndex - 1 : pageIndex);
      }
    },

    /**
       Internal method to create a list of page handle objects for the template
       to render them.

       @return {Array.<Object>} an array of page handle objects hashes
     */
    makeHandles: function () {

      var handles = [];
      var collection = this.collection;
      var state = collection.state;

      // convert all indices to 0-based here
      var firstPage = state.firstPage;
      var lastPage = +state.lastPage;
      lastPage = Math.max(0, firstPage ? lastPage - 1 : lastPage);
      var currentPage = Math.max(state.currentPage, state.firstPage);
      currentPage = firstPage ? currentPage - 1 : currentPage;
      var windowStart = Math.floor(currentPage / this.windowSize) * this.windowSize;
      var windowEnd = Math.min(lastPage + 1, windowStart + this.windowSize);

      if (collection.mode !== "infinite") {
        for (var i = windowStart; i < windowEnd; i++) {
          handles.push({
            label: i + 1,
            title: "No. " + (i + 1),
            className: currentPage === i ? "active" : undefined
          });
        }
      }

      var ffLabels = this.fastForwardHandleLabels;
      if (ffLabels) {

        if (ffLabels.prev) {
          handles.unshift({
            label: ffLabels.prev,
            className: collection.hasPrevious() ? void 0 : "disabled"
          });
        }

        if (ffLabels.first) {
          handles.unshift({
            label: ffLabels.first,
            className: collection.hasPrevious() ? void 0 : "disabled"
          });
        }

        if (ffLabels.next) {
          handles.push({
            label: ffLabels.next,
            className: collection.hasNext() ? void 0 : "disabled"
          });
        }

        if (ffLabels.last) {
          handles.push({
            label: ffLabels.last,
            className: collection.hasNext() ? void 0 : "disabled"
          });
        }
      }

      return handles;
    },

    /**
       Render the paginator handles inside an unordered list.
    */
    render: function () {
      this.$el.empty();

      this.$el.append(this.template({
        handles: this.makeHandles()
      }));

      this.delegateEvents();

      return this;
    }

  });

}(jQuery, _, Backbone, Backgrid));

define("BackgridPaginator", ["jQuery","underscore","backbone","Backgrid"], function(){});

/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.4.3
 * Copyright (C) 2013 Oliver Nightingale
 * MIT Licensed
 * @license
 */
var lunr=function(t){var e=new lunr.Index;return e.pipeline.add(lunr.stopWordFilter,lunr.stemmer),t&&t.call(e,e),e};lunr.version="0.4.3","undefined"!=typeof module&&(module.exports=lunr),lunr.utils={},lunr.utils.warn=function(t){return function(e){t.console&&console.warn&&console.warn(e)}}(this),lunr.utils.zeroFillArray=function(){var t=[0];return function(e){for(;e>t.length;)t=t.concat(t);return t.slice(0,e)}}(),lunr.EventEmitter=function(){this.events={}},lunr.EventEmitter.prototype.addListener=function(){var t=Array.prototype.slice.call(arguments),e=t.pop(),n=t;if("function"!=typeof e)throw new TypeError("last argument must be a function");n.forEach(function(t){this.hasHandler(t)||(this.events[t]=[]),this.events[t].push(e)},this)},lunr.EventEmitter.prototype.removeListener=function(t,e){if(this.hasHandler(t)){var n=this.events[t].indexOf(e);this.events[t].splice(n,1),this.events[t].length||delete this.events[t]}},lunr.EventEmitter.prototype.emit=function(t){if(this.hasHandler(t)){var e=Array.prototype.slice.call(arguments,1);this.events[t].forEach(function(t){t.apply(void 0,e)})}},lunr.EventEmitter.prototype.hasHandler=function(t){return t in this.events},lunr.tokenizer=function(t){if(!arguments.length||null==t||void 0==t)return[];if(Array.isArray(t))return t.map(function(t){return t.toLowerCase()});for(var e=(""+t).replace(/^\s+/,""),n=e.length-1;n>=0;n--)if(/\S/.test(e.charAt(n))){e=e.substring(0,n+1);break}return e.split(/\s+/).map(function(t){return t.replace(/^\W+/,"").replace(/\W+$/,"").toLowerCase()})},lunr.Pipeline=function(){this._stack=[]},lunr.Pipeline.registeredFunctions={},lunr.Pipeline.registerFunction=function(t,e){e in this.registeredFunctions&&lunr.utils.warn("Overwriting existing registered function: "+e),t.label=e,lunr.Pipeline.registeredFunctions[t.label]=t},lunr.Pipeline.warnIfFunctionNotRegistered=function(t){var e=t.label&&t.label in this.registeredFunctions;e||lunr.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",t)},lunr.Pipeline.load=function(t){var e=new lunr.Pipeline;return t.forEach(function(t){var n=lunr.Pipeline.registeredFunctions[t];if(!n)throw Error("Cannot load un-registered function: "+t);e.add(n)}),e},lunr.Pipeline.prototype.add=function(){var t=Array.prototype.slice.call(arguments);t.forEach(function(t){lunr.Pipeline.warnIfFunctionNotRegistered(t),this._stack.push(t)},this)},lunr.Pipeline.prototype.after=function(t,e){lunr.Pipeline.warnIfFunctionNotRegistered(e);var n=this._stack.indexOf(t)+1;this._stack.splice(n,0,e)},lunr.Pipeline.prototype.before=function(t,e){lunr.Pipeline.warnIfFunctionNotRegistered(e);var n=this._stack.indexOf(t);this._stack.splice(n,0,e)},lunr.Pipeline.prototype.remove=function(t){var e=this._stack.indexOf(t);this._stack.splice(e,1)},lunr.Pipeline.prototype.run=function(t){for(var e=[],n=t.length,r=this._stack.length,o=0;n>o;o++){for(var i=t[o],s=0;r>s&&(i=this._stack[s](i,o,t),void 0!==i);s++);void 0!==i&&e.push(i)}return e},lunr.Pipeline.prototype.toJSON=function(){return this._stack.map(function(t){return lunr.Pipeline.warnIfFunctionNotRegistered(t),t.label})},lunr.Vector=function(t){this.elements=t},lunr.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;for(var t,e=0,n=this.elements,r=n.length,o=0;r>o;o++)t=n[o],e+=t*t;return this._magnitude=Math.sqrt(e)},lunr.Vector.prototype.dot=function(t){for(var e=this.elements,n=t.elements,r=e.length,o=0,i=0;r>i;i++)o+=e[i]*n[i];return o},lunr.Vector.prototype.similarity=function(t){return this.dot(t)/(this.magnitude()*t.magnitude())},lunr.Vector.prototype.toArray=function(){return this.elements},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(t){var e=new this;return e.elements=t,e.length=t.length,e},lunr.SortedSet.prototype.add=function(){Array.prototype.slice.call(arguments).forEach(function(t){~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t)},this),this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(t,e){return this.elements.map(t,e)},lunr.SortedSet.prototype.forEach=function(t,e){return this.elements.forEach(t,e)},lunr.SortedSet.prototype.indexOf=function(t,e,n){var e=e||0,n=n||this.elements.length,r=n-e,o=e+Math.floor(r/2),i=this.elements[o];return 1>=r?i===t?o:-1:t>i?this.indexOf(t,o,n):i>t?this.indexOf(t,e,o):i===t?o:void 0},lunr.SortedSet.prototype.locationFor=function(t,e,n){var e=e||0,n=n||this.elements.length,r=n-e,o=e+Math.floor(r/2),i=this.elements[o];if(1>=r){if(i>t)return o;if(t>i)return o+1}return t>i?this.locationFor(t,o,n):i>t?this.locationFor(t,e,o):void 0},lunr.SortedSet.prototype.intersect=function(t){for(var e=new lunr.SortedSet,n=0,r=0,o=this.length,i=t.length,s=this.elements,l=t.elements;;){if(n>o-1||r>i-1)break;s[n]!==l[r]?s[n]<l[r]?n++:s[n]>l[r]&&r++:(e.add(s[n]),n++,r++)}return e},lunr.SortedSet.prototype.clone=function(){var t=new lunr.SortedSet;return t.elements=this.toArray(),t.length=t.elements.length,t},lunr.SortedSet.prototype.union=function(t){var e,n,r;return this.length>=t.length?(e=this,n=t):(e=t,n=this),r=e.clone(),r.add.apply(r,n.toArray()),r},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},lunr.Index=function(){this._fields=[],this._ref="id",this.pipeline=new lunr.Pipeline,this.documentStore=new lunr.Store,this.tokenStore=new lunr.TokenStore,this.corpusTokens=new lunr.SortedSet,this.eventEmitter=new lunr.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},lunr.Index.prototype.on=function(){var t=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,t)},lunr.Index.prototype.off=function(t,e){return this.eventEmitter.removeListener(t,e)},lunr.Index.load=function(t){t.version!==lunr.version&&lunr.utils.warn("version mismatch: current "+lunr.version+" importing "+t.version);var e=new this;return e._fields=t.fields,e._ref=t.ref,e.documentStore=lunr.Store.load(t.documentStore),e.tokenStore=lunr.TokenStore.load(t.tokenStore),e.corpusTokens=lunr.SortedSet.load(t.corpusTokens),e.pipeline=lunr.Pipeline.load(t.pipeline),e},lunr.Index.prototype.field=function(t,e){var e=e||{},n={name:t,boost:e.boost||1};return this._fields.push(n),this},lunr.Index.prototype.ref=function(t){return this._ref=t,this},lunr.Index.prototype.add=function(t,e){var n={},r=new lunr.SortedSet,o=t[this._ref],e=void 0===e?!0:e;this._fields.forEach(function(e){var o=this.pipeline.run(lunr.tokenizer(t[e.name]));n[e.name]=o,lunr.SortedSet.prototype.add.apply(r,o)},this),this.documentStore.set(o,r),lunr.SortedSet.prototype.add.apply(this.corpusTokens,r.toArray());for(var i=0;r.length>i;i++){var s=r.elements[i],l=this._fields.reduce(function(t,e){var r=n[e.name].length;if(!r)return t;var o=n[e.name].filter(function(t){return t===s}).length;return t+o/r*e.boost},0);this.tokenStore.add(s,{ref:o,tf:l})}e&&this.eventEmitter.emit("add",t,this)},lunr.Index.prototype.remove=function(t,e){var n=t[this._ref],e=void 0===e?!0:e;if(this.documentStore.has(n)){var r=this.documentStore.get(n);this.documentStore.remove(n),r.forEach(function(t){this.tokenStore.remove(t,n)},this),e&&this.eventEmitter.emit("remove",t,this)}},lunr.Index.prototype.update=function(t,e){var e=void 0===e?!0:e;this.remove(t,!1),this.add(t,!1),e&&this.eventEmitter.emit("update",t,this)},lunr.Index.prototype.idf=function(t){if(this._idfCache[t])return this._idfCache[t];var e=this.tokenStore.count(t),n=1;return e>0&&(n=1+Math.log(this.tokenStore.length/e)),this._idfCache[t]=n},lunr.Index.prototype.search=function(t){var e=this.pipeline.run(lunr.tokenizer(t)),n=lunr.utils.zeroFillArray(this.corpusTokens.length),r=[],o=this._fields.reduce(function(t,e){return t+e.boost},0),i=e.some(function(t){return this.tokenStore.has(t)},this);if(!i)return[];e.forEach(function(t,e,i){var s=1/i.length*this._fields.length*o,l=this,u=this.tokenStore.expand(t).reduce(function(e,r){var o=l.corpusTokens.indexOf(r),i=l.idf(r),u=1,a=new lunr.SortedSet;if(r!==t){var h=Math.max(3,r.length-t.length);u=1/Math.log(h)}return o>-1&&(n[o]=s*i*u),Object.keys(l.tokenStore.get(r)).forEach(function(t){a.add(t)}),e.union(a)},new lunr.SortedSet);r.push(u)},this);var s=r.reduce(function(t,e){return t.intersect(e)}),l=new lunr.Vector(n);return s.map(function(t){return{ref:t,score:l.similarity(this.documentVector(t))}},this).sort(function(t,e){return e.score-t.score})},lunr.Index.prototype.documentVector=function(t){for(var e=this.documentStore.get(t),n=e.length,r=lunr.utils.zeroFillArray(this.corpusTokens.length),o=0;n>o;o++){var i=e.elements[o],s=this.tokenStore.get(i)[t].tf,l=this.idf(i);r[this.corpusTokens.indexOf(i)]=s*l}return new lunr.Vector(r)},lunr.Index.prototype.toJSON=function(){return{version:lunr.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),tokenStore:this.tokenStore.toJSON(),corpusTokens:this.corpusTokens.toJSON(),pipeline:this.pipeline.toJSON()}},lunr.Store=function(){this.store={},this.length=0},lunr.Store.load=function(t){var e=new this;return e.length=t.length,e.store=Object.keys(t.store).reduce(function(e,n){return e[n]=lunr.SortedSet.load(t.store[n]),e},{}),e},lunr.Store.prototype.set=function(t,e){this.store[t]=e,this.length=Object.keys(this.store).length},lunr.Store.prototype.get=function(t){return this.store[t]},lunr.Store.prototype.has=function(t){return t in this.store},lunr.Store.prototype.remove=function(t){this.has(t)&&(delete this.store[t],this.length--)},lunr.Store.prototype.toJSON=function(){return{store:this.store,length:this.length}},lunr.stemmer=function(){var t={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},e={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",r="[aeiouy]",o=n+"[^aeiouy]*",i=r+"[aeiou]*",s="^("+o+")?"+i+o,l="^("+o+")?"+i+o+"("+i+")?$",u="^("+o+")?"+i+o+i+o,a="^("+o+")?"+r;return function(n){var i,h,c,p,f,d,v;if(3>n.length)return n;if(c=n.substr(0,1),"y"==c&&(n=c.toUpperCase()+n.substr(1)),p=/^(.+?)(ss|i)es$/,f=/^(.+?)([^s])s$/,p.test(n)?n=n.replace(p,"$1$2"):f.test(n)&&(n=n.replace(f,"$1$2")),p=/^(.+?)eed$/,f=/^(.+?)(ed|ing)$/,p.test(n)){var m=p.exec(n);p=RegExp(s),p.test(m[1])&&(p=/.$/,n=n.replace(p,""))}else if(f.test(n)){var m=f.exec(n);i=m[1],f=RegExp(a),f.test(i)&&(n=i,f=/(at|bl|iz)$/,d=RegExp("([^aeiouylsz])\\1$"),v=RegExp("^"+o+r+"[^aeiouwxy]$"),f.test(n)?n+="e":d.test(n)?(p=/.$/,n=n.replace(p,"")):v.test(n)&&(n+="e"))}if(p=/^(.+?)y$/,p.test(n)){var m=p.exec(n);i=m[1],p=RegExp(a),p.test(i)&&(n=i+"i")}if(p=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,p.test(n)){var m=p.exec(n);i=m[1],h=m[2],p=RegExp(s),p.test(i)&&(n=i+t[h])}if(p=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,p.test(n)){var m=p.exec(n);i=m[1],h=m[2],p=RegExp(s),p.test(i)&&(n=i+e[h])}if(p=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,f=/^(.+?)(s|t)(ion)$/,p.test(n)){var m=p.exec(n);i=m[1],p=RegExp(u),p.test(i)&&(n=i)}else if(f.test(n)){var m=f.exec(n);i=m[1]+m[2],f=RegExp(u),f.test(i)&&(n=i)}if(p=/^(.+?)e$/,p.test(n)){var m=p.exec(n);i=m[1],p=RegExp(u),f=RegExp(l),d=RegExp("^"+o+r+"[^aeiouwxy]$"),(p.test(i)||f.test(i)&&!d.test(i))&&(n=i)}return p=/ll$/,f=RegExp(u),p.test(n)&&f.test(n)&&(p=/.$/,n=n.replace(p,"")),"y"==c&&(n=c.toLowerCase()+n.substr(1)),n}}(),lunr.Pipeline.registerFunction(lunr.stemmer,"stemmer"),lunr.stopWordFilter=function(t){return-1===lunr.stopWordFilter.stopWords.indexOf(t)?t:void 0},lunr.stopWordFilter.stopWords=new lunr.SortedSet,lunr.stopWordFilter.stopWords.length=119,lunr.stopWordFilter.stopWords.elements=["","a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"],lunr.Pipeline.registerFunction(lunr.stopWordFilter,"stopWordFilter"),lunr.TokenStore=function(){this.root={docs:{}},this.length=0},lunr.TokenStore.load=function(t){var e=new this;return e.root=t.root,e.length=t.length,e},lunr.TokenStore.prototype.add=function(t,e,n){var n=n||this.root,r=t[0],o=t.slice(1);return r in n||(n[r]={docs:{}}),0===o.length?(n[r].docs[e.ref]=e,this.length+=1,void 0):this.add(o,e,n[r])},lunr.TokenStore.prototype.has=function(t){if(!t)return!1;for(var e=this.root,n=0;t.length>n;n++){if(!e[t[n]])return!1;e=e[t[n]]}return!0},lunr.TokenStore.prototype.getNode=function(t){if(!t)return{};for(var e=this.root,n=0;t.length>n;n++){if(!e[t[n]])return{};e=e[t[n]]}return e},lunr.TokenStore.prototype.get=function(t,e){return this.getNode(t,e).docs||{}},lunr.TokenStore.prototype.count=function(t,e){return Object.keys(this.get(t,e)).length},lunr.TokenStore.prototype.remove=function(t,e){if(t){for(var n=this.root,r=0;t.length>r;r++){if(!(t[r]in n))return;n=n[t[r]]}delete n.docs[e]}},lunr.TokenStore.prototype.expand=function(t,e){var n=this.getNode(t),r=n.docs||{},e=e||[];return Object.keys(r).length&&e.push(t),Object.keys(n).forEach(function(n){"docs"!==n&&e.concat(this.expand(t+n,e))},this),e},lunr.TokenStore.prototype.toJSON=function(){return{root:this.root,length:this.length}};
define("lunr", function(){});

/*
  backgrid-filter
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function(e,t,i,n,s){"use strict";var a=n.Extension.ServerSideFilter=i.View.extend({tagName:"form",className:"backgrid-filter form-search",template:t.template('<div class="input-prepend input-append"><span class="add-on"><i class="icon-search"></i></span><input type="text" <% if (placeholder) { %> placeholder="<%- placeholder %>" <% } %> name="<%- name %>" /><span class="add-on"><a class="close" href="#">&times;</a></span></div>'),events:{"click .close":"clear",submit:"search"},name:"q",placeholder:null,initialize:function(e){n.requireOptions(e,["collection"]),i.View.prototype.initialize.apply(this,arguments),this.name=e.name||this.name,this.placeholder=e.placeholder||this.placeholder;var t=this.collection,s=this;i.PageableCollection&&t instanceof i.PageableCollection&&t.mode=="server"&&(t.queryParams[this.name]=function(){return s.$el.find("input[type=text]").val()})},search:function(e){e&&e.preventDefault();var t={};t[this.name]=this.$el.find("input[type=text]").val(),this.collection.fetch({data:t})},clear:function(e){e&&e.preventDefault(),this.$("input[type=text]").val(null),this.collection.fetch()},render:function(){return this.$el.empty().append(this.template({name:this.name,placeholder:this.placeholder,value:this.value})),this.delegateEvents(),this}}),l=n.Extension.ClientSideFilter=a.extend({events:{"click .close":function(e){e.preventDefault(),this.clear()},"change input[type=text]":"search","keyup input[type=text]":"search",submit:function(e){e.preventDefault(),this.search()}},fields:null,wait:149,initialize:function(e){a.prototype.initialize.apply(this,arguments),this.fields=e.fields||this.fields,this.wait=e.wait||this.wait,this._debounceMethods(["search","clear"]);var i=this.collection,n=this.shadowCollection=i.clone();n.url=i.url,n.sync=i.sync,n.parse=i.parse,this.listenTo(i,"add",function(e,t,i){n.add(e,i)}),this.listenTo(i,"remove",function(e,t,i){n.remove(e,i)}),this.listenTo(i,"sort reset",function(e,i){i=t.extend({reindex:!0},i||{}),i.reindex&&n.reset(e.models)})},_debounceMethods:function(e){t.isString(e)&&(e=[e]),this.undelegateEvents();for(var i=0,n=e.length;n>i;i++){var s=e[i],a=this[s];this[s]=t.debounce(a,this.wait)}this.delegateEvents()},makeMatcher:function(e){var t=new RegExp(e.trim().split(/\W/).join("|"),"i");return function(e){for(var i=this.fields||e.keys(),n=0,s=i.length;s>n;n++)if(t.test(e.get(i[n])+""))return!0;return!1}},search:function(){var e=t.bind(this.makeMatcher(this.$("input[type=text]").val()),this);this.collection.reset(this.shadowCollection.filter(e),{reindex:!1})},clear:function(){this.$("input[type=text]").val(null),this.collection.reset(this.shadowCollection.models,{reindex:!1})}});n.Extension.LunrFilter=l.extend({ref:"id",fields:null,initialize:function(e){l.prototype.initialize.apply(this,arguments),this.ref=e.ref||this.ref;var t=this.collection;this.listenTo(t,"add",this.addToIndex),this.listenTo(t,"remove",this.removeFromIndex),this.listenTo(t,"reset",this.resetIndex),this.listenTo(t,"change",this.updateIndex),this.resetIndex(t)},resetIndex:function(e,i){if(i=t.extend({reindex:!0},i||{}),i.reindex){var n=this;this.index=s(function(){t.each(n.fields,function(e,t){this.field(t,e),this.ref(n.ref)},this)}),e.each(function(e){this.addToIndex(e)},this)}},addToIndex:function(e){var t=this.index,i=e.toJSON();t.documentStore.has(i[this.ref])?t.update(i):t.add(i)},removeFromIndex:function(e){var t=this.index,i=e.toJSON();t.documentStore.has(i[this.ref])&&t.remove(i)},updateIndex:function(e){var i=e.changedAttributes();i&&!t.isEmpty(t.intersection(t.keys(this.fields),t.keys(i)))&&this.index.update(e.toJSON())},search:function(){for(var e=this.index.search(this.$("input[type=text]").val()),t=[],i=0;i<e.length;i++){var n=e[i];t.push(this.shadowCollection.get(n.ref))}this.collection.reset(t,{reindex:!1})}})})(jQuery,_,Backbone,Backgrid,lunr);
define("BackgridFilter", ["jQuery","underscore","backbone","Backgrid","lunr"], function(){});

/**
 * Created by osavch on 26.11.13.
 */
define('src/js/views/BackgridView',[
    "jQuery",
    "underscore",
    "backbone",
    "EJS",
    "text!templates/BodyTpl.html",
    "Backgrid",
    "src/js/gridTemplates/TerritoriesGridColumns",
    "BackgridPaginator",
    "BackgridFilter"
], function ($, _, Backbone, EJS, tpl, Backgrid, territoriesGridColumns) {
    // "use stric";

    var BackgridView = Backbone.View.extend({
        el: "body",
        template: new EJS({text: tpl}),

        initialize: function (options) {

            if (!this.collection) {
                throw new Error('collection is required');
            }
            this.render();
            this.collection.on('reset', this.addGrid, this);
        },

        render: function () {
            this.$el.append(this.template.render());
            return this;
        },

        addGrid: function(territories){
            // Render the grid
            var $gridContainer = $("#example-grid");
            $gridContainer.empty();

            // Set up a grid to use the pageable collection
            var grid = new Backgrid.Grid({
                columns: territoriesGridColumns,
                collection: territories
            });

            $gridContainer.append(grid.render().$el);

            // Initialize the paginator
            var paginator = new Backgrid.Extension.Paginator({
                collection: territories
            });

            // Render the paginator
            $gridContainer.append(paginator.render().$el);

        }
    });

    return BackgridView;
});
/*
 backbone-pageable 1.4.1
 http://github.com/wyuenho/backbone-pageable

 Copyright (c) 2013 Jimmy Yuen Ho Wong
 Licensed under the MIT @license.
 */

(function (factory) {

    // CommonJS
    if (typeof exports == "object") {
        module.exports = factory(require("underscore"), require("backbone"));
    }
    // AMD
    else if (typeof define == "function" && define.amd) {
        define('backbonePageable',["underscore", "backbone"], factory);
    }
    // Browser
    else if (typeof _ !== "undefined" && typeof Backbone !== "undefined") {
        var oldPageableCollection = Backbone.PageableCollection;
        var PageableCollection = factory(_, Backbone);

        /**
         __BROWSER ONLY__

         If you already have an object named `PageableCollection` attached to the
         `Backbone` module, you can use this to return a local reference to this
         Backbone.PageableCollection class and reset the name
         Backbone.PageableCollection to its previous definition.

         // The left hand side gives you a reference to this
         // Backbone.PageableCollection implementation, the right hand side
         // resets Backbone.PageableCollection to your other
         // Backbone.PageableCollection.
         var PageableCollection = Backbone.PageableCollection.noConflict();

         @static
         @member Backbone.PageableCollection
         @return {Backbone.PageableCollection}
         */
        Backbone.PageableCollection.noConflict = function () {
            Backbone.PageableCollection = oldPageableCollection;
            return PageableCollection;
        };
    }

}(function (_, Backbone) {

    "use strict";

    var _extend = _.extend;
    var _omit = _.omit;
    var _clone = _.clone;
    var _each = _.each;
    var _pick = _.pick;
    var _contains = _.contains;
    var _isEmpty = _.isEmpty;
    var _pairs = _.pairs;
    var _invert = _.invert;
    var _isArray = _.isArray;
    var _isFunction = _.isFunction;
    var _isObject = _.isObject;
    var _keys = _.keys;
    var _isUndefined = _.isUndefined;
    var _result = _.result;
    var ceil = Math.ceil;
    var floor = Math.floor;
    var max = Math.max;

    var BBColProto = Backbone.Collection.prototype;

    function finiteInt (val, name) {
        if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
            throw new TypeError("`" + name + "` must be a finite integer");
        }
        return val;
    }

    function queryStringToParams (qs) {
        var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
        var kvps = qs.split('&');
        for (var i = 0, l = kvps.length; i < l; i++) {
            var param = kvps[i];
            kvp = param.split('='), k = kvp[0], v = kvp[1] || true;
            k = decode(k), v = decode(v), ls = params[k];
            if (_isArray(ls)) ls.push(v);
            else if (ls) params[k] = [ls, v];
            else params[k] = v;
        }
        return params;
    }

    // hack to make sure the whatever event handlers for this event is run
    // before func is, and the event handlers that func will trigger.
    function runOnceAtLastHandler (col, event, func) {
        var eventHandlers = col._events[event];
        if (eventHandlers && eventHandlers.length) {
            var lastHandler = eventHandlers[eventHandlers.length - 1];
            var oldCallback = lastHandler.callback;
            lastHandler.callback = function () {
                try {
                    oldCallback.apply(this, arguments);
                    func();
                }
                catch (e) {
                    throw e;
                }
                finally {
                    lastHandler.callback = oldCallback;
                }
            };
        }
        else func();
    }

    var PARAM_TRIM_RE = /[\s'"]/g;
    var URL_TRIM_RE = /[<>\s'"]/g;

    /**
     Drop-in replacement for Backbone.Collection. Supports server-side and
     client-side pagination and sorting. Client-side mode also support fully
     multi-directional synchronization of changes between pages.

     @class Backbone.PageableCollection
     @extends Backbone.Collection
     */
    var PageableCollection = Backbone.PageableCollection = Backbone.Collection.extend({

        /**
         The container object to store all pagination states.

         You can override the default state by extending this class or specifying
         them in an `options` hash to the constructor.

         @property {Object} state

         @property {0|1} [state.firstPage=1] The first page index. Set to 0 if
         your server API uses 0-based indices. You should only override this value
         during extension, initialization or reset by the server after
         fetching. This value should be read only at other times.

         @property {number} [state.lastPage=null] The last page index. This value
         is __read only__ and it's calculated based on whether `firstPage` is 0 or
         1, during bootstrapping, fetching and resetting. Please don't change this
         value under any circumstances.

         @property {number} [state.currentPage=null] The current page index. You
         should only override this value during extension, initialization or reset
         by the server after fetching. This value should be read only at other
         times. Can be a 0-based or 1-based index, depending on whether
         `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
         on initialization.

         @property {number} [state.pageSize=25] How many records to show per
         page. This value is __read only__ after initialization, if you want to
         change the page size after initialization, you must call #setPageSize.

         @property {number} [state.totalPages=null] How many pages there are. This
         value is __read only__ and it is calculated from `totalRecords`.

         @property {number} [state.totalRecords=null] How many records there
         are. This value is __required__ under server mode. This value is optional
         for client mode as the number will be the same as the number of models
         during bootstrapping and during fetching, either supplied by the server
         in the metadata, or calculated from the size of the response.

         @property {string} [state.sortKey=null] The model attribute to use for
         sorting.

         @property {-1|0|1} [state.order=-1] The order to use for sorting. Specify
         -1 for ascending order or 1 for descending order. If 0, no client side
         sorting will be done and the order query parameter will not be sent to
         the server during a fetch.
         */
        state: {
            firstPage: 1,
            lastPage: null,
            currentPage: null,
            pageSize: 25,
            totalPages: null,
            totalRecords: null,
            sortKey: null,
            order: -1
        },

        /**
         @property {"server"|"client"|"infinite"} [mode="server"] The mode of
         operations for this collection. `"server"` paginates on the server-side,
         `"client"` paginates on the client-side and `"infinite"` paginates on the
         server-side for APIs that do not support `totalRecords`.
         */
        mode: "server",

        /**
         A translation map to convert Backbone.PageableCollection state attributes
         to the query parameters accepted by your server API.

         You can override the default state by extending this class or specifying
         them in `options.queryParams` object hash to the constructor.

         @property {Object} queryParams
         @property {string} [queryParams.currentPage="page"]
         @property {string} [queryParams.pageSize="per_page"]
         @property {string} [queryParams.totalPages="total_pages"]
         @property {string} [queryParams.totalRecords="total_entries"]
         @property {string} [queryParams.sortKey="sort_by"]
         @property {string} [queryParams.order="order"]
         @property {string} [queryParams.directions={"-1": "asc", "1": "desc"}] A
         map for translating a Backbone.PageableCollection#state.order constant to
         the ones your server API accepts.
         */
        queryParams: {
            currentPage: "page",
            pageSize: "per_page",
            totalPages: "total_pages",
            totalRecords: "total_entries",
            sortKey: "sort_by",
            order: "order",
            directions: {
                "-1": "asc",
                "1": "desc"
            }
        },

        /**
         __CLIENT MODE ONLY__

         This collection is the internal storage for the bootstrapped or fetched
         models. You can use this if you want to operate on all the pages.

         @property {Backbone.Collection} fullCollection
         */

        /**
         Given a list of models or model attributues, bootstraps the full
         collection in client mode or infinite mode, or just the page you want in
         server mode.

         If you want to initialize a collection to a different state than the
         default, you can specify them in `options.state`. Any state parameters
         supplied will be merged with the default. If you want to change the
         default mapping from #state keys to your server API's query parameter
         names, you can specifiy an object hash in `option.queryParams`. Likewise,
         any mapping provided will be merged with the default. Lastly, all
         Backbone.Collection constructor options are also accepted.

         See:

         - Backbone.PageableCollection#state
         - Backbone.PageableCollection#queryParams
         - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)

         @param {Array.<Object>} [models]

         @param {Object} [options]

         @param {function(*, *): number} [options.comparator] If specified, this
         comparator is set to the current page under server mode, or the #fullCollection
         otherwise.

         @param {boolean} [options.full] If `false` and either a
         `options.comparator` or `sortKey` is defined, the comparator is attached
         to the current page. Default is `true` under client or infinite mode and
         the comparator will be attached to the #fullCollection.

         @param {Object} [options.state] The state attributes overriding the defaults.

         @param {string} [options.state.sortKey] The model attribute to use for
         sorting. If specified instead of `options.comparator`, a comparator will
         be automatically created using this value, and optionally a sorting order
         specified in `options.state.order`. The comparator is then attached to
         the new collection instance.

         @param {-1|1} [options.state.order] The order to use for sorting. Specify
         -1 for ascending order and 1 for descending order.

         @param {Object} [options.queryParam]
         */
        constructor: function (models, options) {

            BBColProto.constructor.apply(this, arguments);

            options = options || {};

            var mode = this.mode = options.mode || this.mode || PageableProto.mode;

            var queryParams = _extend({}, PageableProto.queryParams, this.queryParams,
                options.queryParams || {});

            queryParams.directions = _extend({},
                PageableProto.queryParams.directions,
                this.queryParams.directions,
                queryParams.directions || {});

            this.queryParams = queryParams;

            var state = this.state = _extend({}, PageableProto.state, this.state,
                options.state || {});

            state.currentPage = state.currentPage == null ?
                state.firstPage :
                state.currentPage;

            if (!_isArray(models)) models = models ? [models] : [];

            if (mode != "server" && state.totalRecords == null && !_isEmpty(models)) {
                state.totalRecords = models.length;
            }

            this.switchMode(mode, _extend({fetch: false,
                resetState: false,
                models: models}, options));

            var comparator = options.comparator;

            if (state.sortKey && !comparator) {
                this.setSorting(state.sortKey, state.order, options);
            }

            if (mode != "server") {
                var fullCollection = this.fullCollection;

                if (comparator && options.full) {
                    this.comparator = null;
                    fullCollection.comparator = comparator;
                }

                if (options.full) fullCollection.sort();

                // make sure the models in the current page and full collection have the
                // same references
                if (models && !_isEmpty(models)) {
                    this.reset([].slice.call(models), _extend({silent: true}, options));
                    this.getPage(state.currentPage);
                    models.splice.apply(models, [0, models.length].concat(this.models));
                }
            }

            this._initState = _clone(this.state);
        },

        /**
         Makes a Backbone.Collection that contains all the pages.

         @private
         @param {Array.<Object|Backbone.Model>} models
         @param {Object} options Options for Backbone.Collection constructor.
         @return {Backbone.Collection}
         */
        _makeFullCollection: function (models, options) {

            var properties = ["url", "model", "sync", "comparator"];
            var thisProto = this.constructor.prototype;
            var i, length, prop;

            var proto = {};
            for (i = 0, length = properties.length; i < length; i++) {
                prop = properties[i];
                if (!_isUndefined(thisProto[prop])) {
                    proto[prop] = thisProto[prop];
                }
            }

            var fullCollection = new (Backbone.Collection.extend(proto))(models, options);

            for (i = 0, length = properties.length; i < length; i++) {
                prop = properties[i];
                if (this[prop] !== thisProto[prop]) {
                    fullCollection[prop] = this[prop];
                }
            }

            return fullCollection;
        },

        /**
         Factory method that returns a Backbone event handler that responses to
         the `add`, `remove`, `reset`, and the `sort` events. The returned event
         handler will synchronize the current page collection and the full
         collection's models.

         @private

         @param {Backbone.PageableCollection} pageCol
         @param {Backbone.Collection} fullCol

         @return {function(string, Backbone.Model, Backbone.Collection, Object)}
         Collection event handler
         */
        _makeCollectionEventHandler: function (pageCol, fullCol) {

            return function collectionEventHandler (event, model, collection, options) {

                var handlers = pageCol._handlers;
                _each(_keys(handlers), function (event) {
                    var handler = handlers[event];
                    pageCol.off(event, handler);
                    fullCol.off(event, handler);
                });

                var state = _clone(pageCol.state);
                var firstPage = state.firstPage;
                var currentPage = firstPage === 0 ?
                    state.currentPage :
                    state.currentPage - 1;
                var pageSize = state.pageSize;
                var pageStart = currentPage * pageSize, pageEnd = pageStart + pageSize;

                if (event == "add") {
                    var pageIndex, fullIndex, addAt, colToAdd, options = options || {};
                    if (collection == fullCol) {
                        fullIndex = fullCol.indexOf(model);
                        if (fullIndex >= pageStart && fullIndex < pageEnd) {
                            colToAdd = pageCol;
                            pageIndex = addAt = fullIndex - pageStart;
                        }
                    }
                    else {
                        pageIndex = pageCol.indexOf(model);
                        fullIndex = pageStart + pageIndex;
                        colToAdd = fullCol;
                        var addAt = !_isUndefined(options.at) ?
                            options.at + pageStart :
                            fullIndex;
                    }

                    ++state.totalRecords;
                    pageCol.state = pageCol._checkState(state);

                    if (colToAdd) {
                        colToAdd.add(model, _extend({}, options || {}, {at: addAt}));
                        var modelToRemove = pageIndex >= pageSize ?
                            model :
                            !_isUndefined(options.at) && addAt < pageEnd && pageCol.length > pageSize ?
                                pageCol.at(pageSize) :
                                null;
                        if (modelToRemove) {
                            var popOptions = {onAdd: true};
                            runOnceAtLastHandler(collection, event, function () {
                                pageCol.remove(modelToRemove, popOptions);
                            });
                        }
                    }
                }

                // remove the model from the other collection as well
                if (event == "remove") {
                    if (!options.onAdd) {
                        // decrement totalRecords and update totalPages and lastPage
                        if (!--state.totalRecords) {
                            state.totalRecords = null;
                            state.totalPages = null;
                        }
                        else {
                            var totalPages = state.totalPages = ceil(state.totalRecords / pageSize);
                            state.lastPage = firstPage === 0 ? totalPages - 1 : totalPages || firstPage;
                            if (state.currentPage > totalPages) state.currentPage = state.lastPage;
                        }
                        pageCol.state = pageCol._checkState(state);

                        var nextModel, removedIndex = options.index;
                        if (collection == pageCol) {
                            if (nextModel = fullCol.at(pageEnd)) {
                                runOnceAtLastHandler(pageCol, event, function () {
                                    pageCol.push(nextModel);
                                });
                            }
                            fullCol.remove(model);
                        }
                        else if (removedIndex >= pageStart && removedIndex < pageEnd) {
                            pageCol.remove(model);
                            var at = removedIndex + 1
                            nextModel = fullCol.at(at) || fullCol.last();
                            if (nextModel) pageCol.add(nextModel, {at: at});
                        }
                    }
                    else delete options.onAdd;
                }

                if (event == "reset") {
                    options = collection;
                    collection = model;

                    // Reset that's not a result of getPage
                    if (collection == pageCol && options.from == null &&
                        options.to == null) {
                        var head = fullCol.models.slice(0, pageStart);
                        var tail = fullCol.models.slice(pageStart + pageCol.models.length);
                        fullCol.reset(head.concat(pageCol.models).concat(tail), options);
                    }
                    else if (collection == fullCol) {
                        if (!(state.totalRecords = fullCol.models.length)) {
                            state.totalRecords = null;
                            state.totalPages = null;
                        }
                        if (pageCol.mode == "client") {
                            state.lastPage = state.currentPage = state.firstPage;
                        }
                        pageCol.state = pageCol._checkState(state);
                        pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                            _extend({}, options, {parse: false}));
                    }
                }

                if (event == "sort") {
                    options = collection;
                    collection = model;
                    if (collection === fullCol) {
                        pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                            _extend({}, options, {parse: false}));
                    }
                }

                _each(_keys(handlers), function (event) {
                    var handler = handlers[event];
                    _each([pageCol, fullCol], function (col) {
                        col.on(event, handler);
                        var callbacks = col._events[event] || [];
                        callbacks.unshift(callbacks.pop());
                    });
                });
            };
        },

        /**
         Sanity check this collection's pagination states. Only perform checks
         when all the required pagination state values are defined and not null.
         If `totalPages` is undefined or null, it is set to `totalRecords` /
         `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
         when no error occurs.

         @private

         @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
         `firstPage` is not a finite integer.

         @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
         of bounds.

         @return {Object} Returns the `state` object if no error was found.
         */
        _checkState: function (state) {

            var mode = this.mode;
            var links = this.links;
            var totalRecords = state.totalRecords;
            var pageSize = state.pageSize;
            var currentPage = state.currentPage;
            var firstPage = state.firstPage;
            var totalPages = state.totalPages;

            if (totalRecords != null && pageSize != null && currentPage != null &&
                firstPage != null && (mode == "infinite" ? links : true)) {

                totalRecords = finiteInt(totalRecords, "totalRecords");
                pageSize = finiteInt(pageSize, "pageSize");
                currentPage = finiteInt(currentPage, "currentPage");
                firstPage = finiteInt(firstPage, "firstPage");

                if (pageSize < 1) {
                    throw new RangeError("`pageSize` must be >= 1");
                }

                totalPages = state.totalPages = ceil(totalRecords / pageSize);

                if (firstPage < 0 || firstPage > 1) {
                    throw new RangeError("`firstPage must be 0 or 1`");
                }

                state.lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;

                if (mode == "infinite") {
                    if (!links[currentPage + '']) {
                        throw new RangeError("No link found for page " + currentPage);
                    }
                }
                else if (currentPage < firstPage ||
                    (totalPages > 0 &&
                        (firstPage ? currentPage > totalPages : currentPage >= totalPages))) {
                    var op = firstPage ? ">=" : ">";

                    throw new RangeError("`currentPage` must be firstPage <= currentPage " +
                        (firstPage ? ">" : ">=") +
                        " totalPages if " + firstPage + "-based. Got " +
                        currentPage + '.');
                }
            }

            return state;
        },

        /**
         Change the page size of this collection.

         Under most if not all circumstances, you should call this method to
         change the page size of a pageable collection because it will keep the
         pagination state sane. By default, the method will recalculate the
         current page number to one that will retain the current page's models
         when increasing the page size. When decreasing the page size, this method
         will retain the last models to the current page that will fit into the
         smaller page size.

         If `options.first` is true, changing the page size will also reset the
         current page back to the first page instead of trying to be smart.

         For server mode operations, changing the page size will trigger a #fetch
         and subsequently a `reset` event.

         For client mode operations, changing the page size will `reset` the
         current page by recalculating the current page boundary on the client
         side.

         If `options.fetch` is true, a fetch can be forced if the collection is in
         client mode.

         @param {number} pageSize The new page size to set to #state.
         @param {Object} [options] {@link #fetch} options.
         @param {boolean} [options.first=false] Reset the current page number to
         the first page if `true`.
         @param {boolean} [options.fetch] If `true`, force a fetch in client mode.

         @throws {TypeError} If `pageSize` is not a finite integer.
         @throws {RangeError} If `pageSize` is less than 1.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        setPageSize: function (pageSize, options) {
            pageSize = finiteInt(pageSize, "pageSize");

            options = options || {first: false};

            var state = this.state;
            var totalPages = ceil(state.totalRecords / pageSize);
            var currentPage = totalPages ?
                max(state.firstPage,
                    floor(totalPages *
                        (state.firstPage ?
                            state.currentPage :
                            state.currentPage + 1) /
                        state.totalPages)) :
                state.firstPage;

            state = this.state = this._checkState(_extend({}, state, {
                pageSize: pageSize,
                currentPage: options.first ? state.firstPage : currentPage,
                totalPages: totalPages
            }));

            return this.getPage(state.currentPage, _omit(options, ["first"]));
        },

        /**
         Switching between client, server and infinite mode.

         If switching from client to server mode, the #fullCollection is emptied
         first and then deleted and a fetch is immediately issued for the current
         page from the server. Pass `false` to `options.fetch` to skip fetching.

         If switching to infinite mode, and if `options.models` is given for an
         array of models, #links will be populated with a URL per page, using the
         default URL for this collection.

         If switching from server to client mode, all of the pages are immediately
         refetched. If you have too many pages, you can pass `false` to
         `options.fetch` to skip fetching.

         If switching to any mode from infinite mode, the #links will be deleted.

         @param {"server"|"client"|"infinite"} [mode] The mode to switch to.

         @param {Object} [options]

         @param {boolean} [options.fetch=true] If `false`, no fetching is done.

         @param {boolean} [options.resetState=true] If 'false', the state is not
         reset, but checked for sanity instead.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this if `options.fetch` is `false`.
         */
        switchMode: function (mode, options) {

            if (!_contains(["server", "client", "infinite"], mode)) {
                throw new TypeError('`mode` must be one of "server", "client" or "infinite"');
            }

            options = options || {fetch: true, resetState: true};

            var state = this.state = options.resetState ?
                _clone(this._initState) :
                this._checkState(_extend({}, this.state));

            this.mode = mode;

            var self = this;
            var fullCollection = this.fullCollection;
            var handlers = this._handlers = this._handlers || {}, handler;
            if (mode != "server" && !fullCollection) {
                fullCollection = this._makeFullCollection(options.models || [], options);
                fullCollection.pageableCollection = this;
                this.fullCollection = fullCollection;
                var allHandler = this._makeCollectionEventHandler(this, fullCollection);
                _each(["add", "remove", "reset", "sort"], function (event) {
                    handlers[event] = handler = _.bind(allHandler, {}, event);
                    self.on(event, handler);
                    fullCollection.on(event, handler);
                });
                fullCollection.comparator = this._fullComparator;
            }
            else if (mode == "server" && fullCollection) {
                _each(_keys(handlers), function (event) {
                    handler = handlers[event];
                    self.off(event, handler);
                    fullCollection.off(event, handler);
                });
                delete this._handlers;
                this._fullComparator = fullCollection.comparator;
                delete this.fullCollection;
            }

            if (mode == "infinite") {
                var links = this.links = {};
                var firstPage = state.firstPage;
                var totalPages = ceil(state.totalRecords / state.pageSize);
                var lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
                for (var i = state.firstPage; i <= lastPage; i++) {
                    links[i] = this.url;
                }
            }
            else if (this.links) delete this.links;

            return options.fetch ?
                this.fetch(_omit(options, "fetch", "resetState")) :
                this;
        },

        /**
         @return {boolean} `true` if this collection can page backward, `false`
         otherwise.
         */
        hasPrevious: function () {
            var state = this.state;
            var currentPage = state.currentPage;
            if (this.mode != "infinite") return currentPage > state.firstPage;
            return !!this.links[currentPage - 1];
        },

        /**
         @return {boolean} `true` if this collection can page forward, `false`
         otherwise.
         */
        hasNext: function () {
            var state = this.state;
            var currentPage = this.state.currentPage;
            if (this.mode != "infinite") return currentPage < state.lastPage;
            return !!this.links[currentPage + 1];
        },

        /**
         Fetch the first page in server mode, or reset the current page of this
         collection to the first page in client or infinite mode.

         @param {Object} options {@link #getPage} options.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        getFirstPage: function (options) {
            return this.getPage("first", options);
        },

        /**
         Fetch the previous page in server mode, or reset the current page of this
         collection to the previous page in client or infinite mode.

         @param {Object} options {@link #getPage} options.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        getPreviousPage: function (options) {
            return this.getPage("prev", options);
        },

        /**
         Fetch the next page in server mode, or reset the current page of this
         collection to the next page in client mode.

         @param {Object} options {@link #getPage} options.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        getNextPage: function (options) {
            return this.getPage("next", options);
        },

        /**
         Fetch the last page in server mode, or reset the current page of this
         collection to the last page in client mode.

         @param {Object} options {@link #getPage} options.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        getLastPage: function (options) {
            return this.getPage("last", options);
        },

        /**
         Given a page index, set #state.currentPage to that index. If this
         collection is in server mode, fetch the page using the updated state,
         otherwise, reset the current page of this collection to the page
         specified by `index` in client mode. If `options.fetch` is true, a fetch
         can be forced in client mode before resetting the current page. Under
         infinite mode, if the index is less than the current page, a reset is
         done as in client mode. If the index is greater than the current page
         number, a fetch is made with the results **appended** to #fullCollection.
         The current page will then be reset after fetching.

         @param {number|string} index The page index to go to, or the page name to
         look up from #links in infinite mode.
         @param {Object} [options] {@link #fetch} options or
         [reset](http://backbonejs.org/#Collection-reset) options for client mode
         when `options.fetch` is `false`.
         @param {boolean} [options.fetch=false] If true, force a {@link #fetch} in
         client mode.

         @throws {TypeError} If `index` is not a finite integer under server or
         client mode, or does not yield a URL from #links under infinite mode.

         @throws {RangeError} If `index` is out of bounds.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        getPage: function (index, options) {

            var mode = this.mode, fullCollection = this.fullCollection;

            options = options || {fetch: false};

            var state = this.state,
                firstPage = state.firstPage,
                currentPage = state.currentPage,
                lastPage = state.lastPage,
                pageSize = state.pageSize;

            var pageNum = index;
            switch (index) {
                case "first": pageNum = firstPage; break;
                case "prev": pageNum = currentPage - 1; break;
                case "next": pageNum = currentPage + 1; break;
                case "last": pageNum = lastPage; break;
                default: pageNum = finiteInt(index, "index");
            }

            this.state = this._checkState(_extend({}, state, {currentPage: pageNum}));

            options.from = currentPage, options.to = pageNum;

            var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
            var pageModels = fullCollection && fullCollection.length ?
                fullCollection.models.slice(pageStart, pageStart + pageSize) :
                [];
            if ((mode == "client" || (mode == "infinite" && !_isEmpty(pageModels))) &&
                !options.fetch) {
                this.reset(pageModels, _omit(options, "fetch"));
                return this;
            }

            if (mode == "infinite") options.url = this.links[pageNum];

            return this.fetch(_omit(options, "fetch"));
        },

        /**
         Fetch the page for the provided item offset in server mode, or reset the current page of this
         collection to the page for the provided item offset in client mode.

         @param {Object} options {@link #getPage} options.

         @chainable
         @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
         from fetch or this.
         */
        getPageByOffset: function (offset, options) {
            if (offset < 0) {
                throw new RangeError("`offset must be > 0`");
            }
            offset = finiteInt(offset);

            var page = floor(offset / this.state.pageSize);
            if (this.state.firstPage !== 0) page++;
            if (page > this.state.lastPage) page = this.state.lastPage;
            return this.getPage(page, options);
        },

        /**
         Overidden to make `getPage` compatible with Zepto.

         @param {string} method
         @param {Backbone.Model|Backbone.Collection} model
         @param {Object} [options]

         @return {XMLHttpRequest}
         */
        sync: function (method, model, options) {
            var self = this;
            if (self.mode == "infinite") {
                var success = options.success;
                var currentPage = self.state.currentPage;
                options.success = function (resp, status, xhr) {
                    var links = self.links;
                    var newLinks = self.parseLinks(resp, _extend({xhr: xhr}, options));
                    if (newLinks.first) links[self.state.firstPage] = newLinks.first;
                    if (newLinks.prev) links[currentPage - 1] = newLinks.prev;
                    if (newLinks.next) links[currentPage + 1] = newLinks.next;
                    if (success) success(resp, status, xhr);
                };
            }

            return (BBColProto.sync || Backbone.sync).call(self, method, model, options);
        },

        /**
         Parse pagination links from the server response. Only valid under
         infinite mode.

         Given a response body and a XMLHttpRequest object, extract pagination
         links from them for infinite paging.

         This default implementation parses the RFC 5988 `Link` header and extract
         3 links from it - `first`, `prev`, `next`. If a `previous` link is found,
         it will be found in the `prev` key in the returned object hash. Any
         subclasses overriding this method __must__ return an object hash having
         only the keys above. If `first` is missing, the collection's default URL
         is assumed to be the `first` URL. If `prev` or `next` is missing, it is
         assumed to be `null`. An empty object hash must be returned if there are
         no links found. If either the response or the header contains information
         pertaining to the total number of records on the server, #state.totalRecords
         must be set to that number. The default implementation uses the `last`
         link from the header to calculate it.

         @param {*} resp The deserialized response body.
         @param {Object} [options]
         @param {XMLHttpRequest} [options.xhr] The XMLHttpRequest object for this
         response.
         @return {Object}
         */
        parseLinks: function (resp, options) {
            var links = {};
            var linkHeader = options.xhr.getResponseHeader("Link");
            if (linkHeader) {
                var relations = ["first", "prev", "previous", "next", "last"];
                _each(linkHeader.split(","), function (linkValue) {
                    var linkParts = linkValue.split(";");
                    var url = linkParts[0].replace(URL_TRIM_RE, '');
                    var params = linkParts.slice(1);
                    _each(params, function (param) {
                        var paramParts = param.split("=");
                        var key = paramParts[0].replace(PARAM_TRIM_RE, '');
                        var value = paramParts[1].replace(PARAM_TRIM_RE, '');
                        if (key == "rel" && _contains(relations, value)) {
                            if (value == "previous") links.prev = url;
                            else links[value] = url;
                        }
                    });
                });

                var last = links.last || '', qsi, qs;
                if (qs = (qsi = last.indexOf('?')) ? last.slice(qsi + 1) : '') {
                    var params = queryStringToParams(qs);

                    var state = _clone(this.state);
                    var queryParams = this.queryParams;
                    var pageSize = state.pageSize;

                    var totalRecords = params[queryParams.totalRecords] * 1;
                    var pageNum = params[queryParams.currentPage] * 1;
                    var totalPages = params[queryParams.totalPages];

                    if (!totalRecords) {
                        if (pageNum) totalRecords = (state.firstPage === 0 ?
                            pageNum + 1 :
                            pageNum) * pageSize;
                        else if (totalPages) totalRecords = totalPages * pageSize;
                    }

                    if (totalRecords) state.totalRecords = totalRecords;

                    this.state = this._checkState(state);
                }
            }

            delete links.last;

            return links;
        },

        /**
         Parse server response data.

         This default implementation assumes the response data is in one of two
         structures:

         [
         {}, // Your new pagination state
         [{}, ...] // An array of JSON objects
         ]

         Or,

         [{}] // An array of JSON objects

         The first structure is the preferred form because the pagination states
         may have been updated on the server side, sending them down again allows
         this collection to update its states. If the response has a pagination
         state object, it is checked for errors.

         The second structure is the
         [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
         default.

         **Note:** this method has been further simplified since 1.1.7. While
         existing #parse implementations will continue to work, new code is
         encouraged to override #parseState and #parseRecords instead.

         @param {Object} resp The deserialized response data from the server.
         @param {Object} the options for the ajax request

         @return {Array.<Object>} An array of model objects
         */
        parse: function (resp, options) {
            var newState = this.parseState(resp, _clone(this.queryParams), _clone(this.state), options);
            if (newState) this.state = this._checkState(_extend({}, this.state, newState));
            return this.parseRecords(resp, options);
        },

        /**
         Parse server response for server pagination state updates.

         This default implementation first checks whether the response has any
         state object as documented in #parse. If it exists, a state object is
         returned by mapping the server state keys to this pageable collection
         instance's query parameter keys using `queryParams`.

         It is __NOT__ neccessary to return a full state object complete with all
         the mappings defined in #queryParams. Any state object resulted is merged
         with a copy of the current pageable collection state and checked for
         sanity before actually updating. Most of the time, simply providing a new
         `totalRecords` value is enough to trigger a full pagination state
         recalculation.

         parseState: function (resp, queryParams, state, options) {
             return {totalRecords: resp.total_entries};
           }

         If you want to use header fields use:

         parseState: function (resp, queryParams, state, options) {
               return {totalRecords: options.xhr.getResponseHeader("X-total")};
           }

         This method __MUST__ return a new state object instead of directly
         modifying the #state object. The behavior of directly modifying #state is
         undefined.

         @param {Object} resp The deserialized response data from the server.
         @param {Object} queryParams A copy of #queryParams.
         @param {Object} state A copy of #state.
         @param {Object} [options] The options passed through from
         `parse`. (backbone >= 0.9.10 only)

         @return {Object} A new (partial) state object.
         */
        parseState: function (resp, queryParams, state, options) {
            if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {

                var newState = _clone(state);
                var serverState = resp[0];

                _each(_pairs(_omit(queryParams, "directions")), function (kvp) {
                    var k = kvp[0], v = kvp[1];
                    var serverVal = serverState[v];
                    if (!_isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
                });

                if (serverState.order) {
                    newState.order = _invert(queryParams.directions)[serverState.order] * 1;
                }

                return newState;
            }
        },

        /**
         Parse server response for an array of model objects.

         This default implementation first checks whether the response has any
         state object as documented in #parse. If it exists, the array of model
         objects is assumed to be the second element, otherwise the entire
         response is returned directly.

         @param {Object} resp The deserialized response data from the server.
         @param {Object} [options] The options passed through from the
         `parse`. (backbone >= 0.9.10 only)

         @return {Array.<Object>} An array of model objects
         */
        parseRecords: function (resp, options) {
            if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
                return resp[1];
            }

            return resp;
        },

        /**
         Fetch a page from the server in server mode, or all the pages in client
         mode. Under infinite mode, the current page is refetched by default and
         then reset.

         The query string is constructed by translating the current pagination
         state to your server API query parameter using #queryParams.  The current
         page will reset after fetch.

         @param {Object} [options] Accepts all
         [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
         options.

         @return {XMLHttpRequest}
         */
        fetch: function (options) {

            options = options || {};

            var state = this._checkState(this.state);

            var mode = this.mode;

            if (mode == "infinite" && !options.url) {
                options.url = this.links[state.currentPage];
            }

            var data = options.data || {};

            // dedup query params
            var url = _result(options, "url") || _result(this, "url") || '';
            var qsi = url.indexOf('?');
            if (qsi != -1) {
                _extend(data, queryStringToParams(url.slice(qsi + 1)));
                url = url.slice(0, qsi);
            }

            options.url = url;
            options.data = data;

            // map params except directions
            var queryParams = this.mode == "client" ?
                _pick(this.queryParams, "sortKey", "order") :
                _omit(_pick(this.queryParams, _keys(PageableProto.queryParams)),
                    "directions");

            var i, kvp, k, v, kvps = _pairs(queryParams), thisCopy = _clone(this);
            for (i = 0; i < kvps.length; i++) {
                kvp = kvps[i], k = kvp[0], v = kvp[1];
                v = _isFunction(v) ? v.call(thisCopy) : v;
                if (state[k] != null && v != null) {
                    data[v] = state[k];
                }
            }

            // fix up sorting parameters
            if (state.sortKey && state.order) {
                data[queryParams.order] = this.queryParams.directions[state.order + ""];
            }
            else if (!state.sortKey) delete data[queryParams.order];

            // map extra query parameters
            var extraKvps = _pairs(_omit(this.queryParams,
                _keys(PageableProto.queryParams)));
            for (i = 0; i < extraKvps.length; i++) {
                kvp = extraKvps[i];
                v = kvp[1];
                v = _isFunction(v) ? v.call(thisCopy) : v;
                if (v != null) data[kvp[0]] = v;
            }

            if (mode != "server") {
                var self = this, fullCol = this.fullCollection;
                var success = options.success;
                options.success = function (col, resp, opts) {

                    // make sure the caller's intent is obeyed
                    opts = opts || {};
                    if (_isUndefined(options.silent)) delete opts.silent;
                    else opts.silent = options.silent;

                    var models = col.models;
                    if (mode == "client") fullCol.reset(models, opts);
                    else fullCol.add(models, _extend({at: fullCol.length}, opts));

                    if (success) success(col, resp, opts);
                };

                // silent the first reset from backbone
                return BBColProto.fetch.call(self, _extend({}, options, {silent: true}));
            }

            return BBColProto.fetch.call(this, options);
        },

        /**
         Convenient method for making a `comparator` sorted by a model attribute
         identified by `sortKey` and ordered by `order`.

         Like a Backbone.Collection, a Backbone.PageableCollection will maintain
         the __current page__ in sorted order on the client side if a `comparator`
         is attached to it. If the collection is in client mode, you can attach a
         comparator to #fullCollection to have all the pages reflect the global
         sorting order by specifying an option `full` to `true`. You __must__ call
         `sort` manually or #fullCollection.sort after calling this method to
         force a resort.

         While you can use this method to sort the current page in server mode,
         the sorting order may not reflect the global sorting order due to the
         additions or removals of the records on the server since the last
         fetch. If you want the most updated page in a global sorting order, it is
         recommended that you set #state.sortKey and optionally #state.order, and
         then call #fetch.

         @protected

         @param {string} [sortKey=this.state.sortKey] See `state.sortKey`.
         @param {number} [order=this.state.order] See `state.order`.
         @param {(function(Backbone.Model, string): Object) | string} [sortValue] See #setSorting.

         See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
         */
        _makeComparator: function (sortKey, order, sortValue) {
            var state = this.state;

            sortKey = sortKey || state.sortKey;
            order = order || state.order;

            if (!sortKey || !order) return;

            if (!sortValue) sortValue = function (model, attr) {
                return model.get(attr);
            };

            return function (left, right) {
                var l = sortValue(left, sortKey), r = sortValue(right, sortKey), t;
                if (order === 1) t = l, l = r, r = t;
                if (l === r) return 0;
                else if (l < r) return -1;
                return 1;
            };
        },

        /**
         Adjusts the sorting for this pageable collection.

         Given a `sortKey` and an `order`, sets `state.sortKey` and
         `state.order`. A comparator can be applied on the client side to sort in
         the order defined if `options.side` is `"client"`. By default the
         comparator is applied to the #fullCollection. Set `options.full` to
         `false` to apply a comparator to the current page under any mode. Setting
         `sortKey` to `null` removes the comparator from both the current page and
         the full collection.

         If a `sortValue` function is given, it will be passed the `(model,
         sortKey)` arguments and is used to extract a value from the model during
         comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
         used for sorting.

         @chainable

         @param {string} sortKey See `state.sortKey`.
         @param {number} [order=this.state.order] See `state.order`.
         @param {Object} [options]
         @param {"server"|"client"} [options.side] By default, `"client"` if
         `mode` is `"client"`, `"server"` otherwise.
         @param {boolean} [options.full=true]
         @param {(function(Backbone.Model, string): Object) | string} [options.sortValue]
         */
        setSorting: function (sortKey, order, options) {

            var state = this.state;

            state.sortKey = sortKey;
            state.order = order = order || state.order;

            var fullCollection = this.fullCollection;

            var delComp = false, delFullComp = false;

            if (!sortKey) delComp = delFullComp = true;

            var mode = this.mode;
            options = _extend({side: mode == "client" ? mode : "server", full: true},
                options);

            var comparator = this._makeComparator(sortKey, order, options.sortValue);

            var full = options.full, side = options.side;

            if (side == "client") {
                if (full) {
                    if (fullCollection) fullCollection.comparator = comparator;
                    delComp = true;
                }
                else {
                    this.comparator = comparator;
                    delFullComp = true;
                }
            }
            else if (side == "server" && !full) {
                this.comparator = comparator;
            }

            if (delComp) this.comparator = null;
            if (delFullComp && fullCollection) fullCollection.comparator = null;

            return this;
        }

    });

    var PageableProto = PageableCollection.prototype;

    return PageableCollection;

}));
/**
 * Created by osavch on 26.11.13.
 */
define('src/js/models/Territorium',["backbone"], function (Backbone) {
    var Territorium = Backbone.Model.extend({});

    return Territorium
});
/**
 * Created by osavch on 27.11.13.
 */
define('src/js/collections/PageableTerritories',["backbone", "backbonePageable", "src/js/models/Territorium"],function(Backbone, PageableCollection, Territorium){

    var PageableTerritories = PageableCollection.extend({
        model: Territorium,
        url: "jsons/pageable-territories.json",
        state: {
            pageSize: 15
        },
        mode: "client" // page entirely on the client side
    });

    return PageableTerritories;
});
/**
 * Created by osavch on 26.11.13.
 */
define('src/js/routers/MainRoute',[
    "src/js/views/BackgridView",
    "src/js/collections/PageableTerritories"
], function (BackgridView, PageableTerritories) {

    var MainRoute = Backbone.Router.extend({
        routes: {
            '': 'index',
            "index": "index"
        },

        index: function(){
            console.log('loaded...');
            var pageableTerritories = new PageableTerritories(),
                backgridView = new BackgridView({collection: pageableTerritories});
            console.log('loaded');
            pageableTerritories.fetch({reset: true});
        }
    });

    return MainRoute;
});
/**
 * Created by osavch on 26.11.13.
 */

require([
    "backbone",
    "src/js/routers/MainRoute",
    "Backgrid"
],function(Backbone, MainRoute, Backgrid) {
    new MainRoute();
    Backbone.history.start();
});
define("src/js/pages/main.js", function(){});
