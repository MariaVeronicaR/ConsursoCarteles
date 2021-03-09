/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs4/dt-1.10.23/e-1.9.6
 *
 * Included libraries:
 *   DataTables 1.10.23, Editor 1.9.6
 */

/*! DataTables 1.10.23
 * ©2008-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.23
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Protect against prototype pollution
					if (a[i] === '__proto__' || a[i] === 'constructor') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
		$(thead).children('tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.23";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs4/dt-1.10.23/e-1.9.6",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.6
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2021 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

E1aa[191908]=(function(){var p=2;for(;p !== 9;){switch(p){case 5:var E;try{var m=2;for(;m !== 6;){switch(m){case 3:throw "";m=9;break;case 4:m=typeof R8htd === '\u0075\x6e\x64\u0065\x66\u0069\u006e\x65\x64'?3:9;break;case 9:delete E['\x52\u0038\u0068\x74\u0064'];var o=Object['\x70\u0072\x6f\u0074\x6f\u0074\u0079\x70\x65'];delete o['\u0062\u0055\u0045\x6f\x49'];m=6;break;case 2:Object['\u0064\x65\x66\u0069\u006e\x65\u0050\x72\x6f\x70\x65\x72\u0074\u0079'](Object['\x70\u0072\x6f\u0074\u006f\x74\u0079\u0070\u0065'],'\u0062\u0055\u0045\x6f\u0049',{'\x67\x65\x74':function(){var H=2;for(;H !== 1;){switch(H){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});E=bUEoI;E['\u0052\x38\x68\x74\x64']=E;m=4;break;}}}catch(S){E=window;}return E;break;case 1:return globalThis;break;case 2:p=typeof globalThis === '\x6f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();E1aa[485127]=T255(E1aa[191908]);E1aa[553410]=x0ff(E1aa[191908]);E1aa.W2x=function(){return typeof E1aa.J2x.s38 === 'function'?E1aa.J2x.s38.apply(E1aa.J2x,arguments):E1aa.J2x.s38;};E1aa.J2x=(function(){var R2x=2;for(;R2x !== 9;){switch(R2x){case 3:return m2x[9];break;case 2:var m2x=[arguments];m2x[8]=undefined;m2x[9]={};m2x[9].s38=function(){var d2x=2;for(;d2x !== 145;){switch(d2x){case 14:M2x[5].n0Z=['K1Z'];M2x[5].H1Z=function(){var O38=function(){return ('x').startsWith('x');};var c38=(/\x74\u0072\u0075\u0065/).F0ff(O38 + []);return c38;};M2x[9]=M2x[5];M2x[1]={};M2x[1].n0Z=['m1Z'];d2x=20;break;case 108:M2x[2].p0ff(M2x[13]);M2x[2].p0ff(M2x[91]);M2x[2].p0ff(M2x[26]);M2x[2].p0ff(M2x[84]);M2x[92]=[];M2x[80]='J0Z';d2x=133;break;case 148:d2x=74?148:147;break;case 38:M2x[77].n0Z=['X1Z'];M2x[77].H1Z=function(){var Y48=false;var N48=[];try{for(var d48 in console){N48.p0ff(d48);}Y48=N48.length === 0;}catch(i48){}var b48=Y48;return b48;};M2x[68]=M2x[77];M2x[31]={};M2x[31].n0Z=['K1Z'];d2x=52;break;case 84:M2x[95]=M2x[42];M2x[48]={};M2x[48].n0Z=['m1Z','h1Z'];d2x=81;break;case 126:M2x[89]=M2x[2][M2x[29]];try{M2x[55]=M2x[89][M2x[76]]()?M2x[80]:M2x[78];}catch(O48){M2x[55]=M2x[78];}d2x=124;break;case 111:M2x[2].p0ff(M2x[68]);M2x[2].p0ff(M2x[19]);M2x[2].p0ff(M2x[23]);d2x=108;break;case 127:d2x=M2x[29] < M2x[2].length?126:149;break;case 71:M2x[40]=M2x[12];M2x[60]={};M2x[60].n0Z=['X1Z'];d2x=68;break;case 93:M2x[2].p0ff(M2x[35]);M2x[2].p0ff(M2x[16]);M2x[2].p0ff(M2x[4]);M2x[2].p0ff(M2x[3]);M2x[2].p0ff(M2x[7]);d2x=117;break;case 95:M2x[2].p0ff(M2x[83]);M2x[2].p0ff(M2x[86]);d2x=93;break;case 122:M2x[33]={};M2x[33][M2x[85]]=M2x[89][M2x[96]][M2x[73]];M2x[33][M2x[32]]=M2x[55];M2x[92].p0ff(M2x[33]);d2x=151;break;case 133:M2x[78]='o0Z';M2x[96]='n0Z';M2x[32]='Z1Z';d2x=130;break;case 99:M2x[84]=M2x[27];M2x[2].p0ff(M2x[94]);M2x[2].p0ff(M2x[64]);M2x[2].p0ff(M2x[9]);d2x=95;break;case 150:M2x[29]++;d2x=127;break;case 146:return 68;break;case 41:M2x[81].H1Z=function(){var X48=function(){'use stirct';return 1;};var A48=!(/\x73\u0074\x69\u0072\x63\x74/).F0ff(X48 + []);return A48;};M2x[86]=M2x[81];M2x[77]={};d2x=38;break;case 124:M2x[73]=0;d2x=123;break;case 15:M2x[4]=M2x[6];M2x[34]={};M2x[34].n0Z=['h1Z'];M2x[34].H1Z=function(){var W38=function(){var M38;switch(M38){case 0:break;}};var Q38=!(/\x30/).F0ff(W38 + []);return Q38;};d2x=24;break;case 4:M2x[2]=[];M2x[8]={};M2x[8].n0Z=['X1Z'];d2x=8;break;case 58:M2x[58].n0Z=['m1Z'];M2x[58].H1Z=function(){var C48=function(q48,a48){if(q48){return q48;}return a48;};var G48=(/\x3f/).F0ff(C48 + []);return G48;};M2x[35]=M2x[58];M2x[20]={};M2x[20].n0Z=['m1Z','h1Z'];M2x[20].H1Z=function(){var H48=function(P48){return P48 && P48['b'];};var t48=(/\x2e/).F0ff(H48 + []);return t48;};M2x[46]=M2x[20];d2x=74;break;case 81:M2x[48].H1Z=function(){var B48=function(n48){return n48 && n48['b'];};var e48=(/\u002e/).F0ff(B48 + []);return e48;};d2x=80;break;case 117:M2x[2].p0ff(M2x[95]);M2x[2].p0ff(M2x[46]);M2x[2].p0ff(M2x[52]);M2x[2].p0ff(M2x[45]);M2x[2].p0ff(M2x[21]);M2x[2].p0ff(M2x[40]);d2x=111;break;case 103:M2x[21]=M2x[17];M2x[27]={};M2x[27].n0Z=['K1Z'];M2x[27].H1Z=function(){var v48=function(){return String.fromCharCode(0x61);};var E48=!(/\x30\u0078\u0036\x31/).F0ff(v48 + []);return E48;};d2x=99;break;case 80:M2x[23]=M2x[48];M2x[17]={};M2x[17].n0Z=['m1Z','h1Z'];M2x[17].H1Z=function(){var z48=function(){return 1024 * 1024;};var T48=(/[5-8]/).F0ff(z48 + []);return T48;};d2x=103;break;case 128:M2x[29]=0;d2x=127;break;case 151:M2x[73]++;d2x=123;break;case 74:M2x[12]={};M2x[12].n0Z=['h1Z'];M2x[12].H1Z=function(){var Z48=function(){if(false){console.log(1);}};var D48=!(/\x31/).F0ff(Z48 + []);return D48;};d2x=71;break;case 20:M2x[1].H1Z=function(){var K38=function(){return new RegExp('/ /');};var f38=(typeof K38,!(/\u006e\x65\u0077/).F0ff(K38 + []));return f38;};M2x[7]=M2x[1];M2x[6]={};M2x[6].n0Z=['m1Z'];M2x[6].H1Z=function(){var l38=function(){return parseInt("0xff");};var j38=!(/\u0078/).F0ff(l38 + []);return j38;};d2x=15;break;case 68:M2x[60].H1Z=function(){var y48=typeof w0ff === 'function';return y48;};M2x[19]=M2x[60];d2x=66;break;case 29:M2x[49].n0Z=['K1Z'];M2x[49].H1Z=function(){var g48=function(){return [] + ('a').concat('a');};var k48=!(/\u005b\x5d/).F0ff(g48 + []) && (/\u0061\x61/).F0ff(g48 + []);return k48;};M2x[52]=M2x[49];M2x[81]={};M2x[81].n0Z=['h1Z'];d2x=41;break;case 5:return 51;break;case 45:M2x[25].n0Z=['m1Z','h1Z'];M2x[25].H1Z=function(){var w48=function(){return 1024 * 1024;};var R48=(/[5-67-8]/).F0ff(w48 + []);return R48;};M2x[45]=M2x[25];M2x[72]={};d2x=62;break;case 1:d2x=m2x[8]?5:4;break;case 147:m2x[8]=60;d2x=146;break;case 130:M2x[76]='H1Z';M2x[85]='W0Z';d2x=128;break;case 52:M2x[31].H1Z=function(){var F48=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var p48=(/\x74\u0072\u0075\x65/).F0ff(F48 + []);return p48;};M2x[16]=M2x[31];M2x[75]={};M2x[75].n0Z=['X1Z'];M2x[75].H1Z=function(){var h48=typeof h0ff === 'function';return h48;};M2x[94]=M2x[75];M2x[25]={};d2x=45;break;case 33:M2x[57].n0Z=['m1Z'];M2x[57].H1Z=function(){var r48=function(){return ("01").substr(1);};var J48=!(/\x30/).F0ff(r48 + []);return J48;};M2x[26]=M2x[57];M2x[49]={};d2x=29;break;case 24:M2x[91]=M2x[34];M2x[36]={};M2x[36].n0Z=['h1Z'];M2x[36].H1Z=function(){var S38=function(){debugger;};var s48=!(/\x64\u0065\u0062\x75\x67\x67\x65\x72/).F0ff(S38 + []);return s48;};M2x[64]=M2x[36];M2x[57]={};d2x=33;break;case 62:M2x[72].n0Z=['K1Z'];M2x[72].H1Z=function(){var L48=function(){return decodeURI('%25');};var u48=!(/\x32\u0035/).F0ff(L48 + []);return u48;};M2x[83]=M2x[72];M2x[58]={};d2x=58;break;case 2:var M2x=[arguments];d2x=1;break;case 66:M2x[18]={};M2x[18].n0Z=['K1Z'];M2x[18].H1Z=function(){var x48=function(){var o48=function(V48){for(var m48=0;m48 < 20;m48++){V48+=m48;}return V48;};o48(2);};var U48=(/\u0031\x39\x32/).F0ff(x48 + []);return U48;};d2x=88;break;case 88:M2x[13]=M2x[18];M2x[42]={};M2x[42].n0Z=['X1Z'];M2x[42].H1Z=function(){var I48=typeof R0ff === 'function';return I48;};d2x=84;break;case 8:M2x[8].H1Z=function(){function T38(v38,E38){return v38 + E38;};var z38=(/\u006f\u006e[ \f\n\u180e\u205f\u00a0\u1680\t\v\u2000-\u200a\r\u2028\u2029\u202f\ufeff\u3000]{0,}\u0028/).F0ff(T38 + []);return z38;};M2x[3]=M2x[8];M2x[5]={};d2x=14;break;case 149:d2x=(function(g2x){var S2x=2;for(;S2x !== 22;){switch(S2x){case 17:v2x[3]=0;S2x=16;break;case 23:return v2x[7];break;case 19:v2x[3]++;S2x=7;break;case 11:v2x[8][v2x[2][M2x[85]]].t+=true;S2x=10;break;case 25:v2x[7]=true;S2x=24;break;case 15:v2x[6]=v2x[4][v2x[3]];v2x[1]=v2x[8][v2x[6]].h / v2x[8][v2x[6]].t;S2x=26;break;case 24:v2x[3]++;S2x=16;break;case 18:v2x[7]=false;S2x=17;break;case 26:S2x=v2x[1] >= 0.5?25:24;break;case 4:v2x[8]={};v2x[4]=[];v2x[3]=0;S2x=8;break;case 16:S2x=v2x[3] < v2x[4].length?15:23;break;case 13:v2x[8][v2x[2][M2x[85]]]=(function(){var G2x=2;for(;G2x !== 9;){switch(G2x){case 3:return x2x[3];break;case 2:var x2x=[arguments];x2x[3]={};x2x[3].h=0;x2x[3].t=0;G2x=3;break;}}}).L0ff(this,arguments);S2x=12;break;case 2:var v2x=[arguments];S2x=1;break;case 1:S2x=v2x[0][0].length === 0?5:4;break;case 5:return;break;case 8:v2x[3]=0;S2x=7;break;case 20:v2x[8][v2x[2][M2x[85]]].h+=true;S2x=19;break;case 7:S2x=v2x[3] < v2x[0][0].length?6:18;break;case 6:v2x[2]=v2x[0][0][v2x[3]];S2x=14;break;case 10:S2x=v2x[2][M2x[32]] === M2x[80]?20:19;break;case 14:S2x=typeof v2x[8][v2x[2][M2x[85]]] === 'undefined'?13:11;break;case 12:v2x[4].p0ff(v2x[2][M2x[85]]);S2x=11;break;}}})(M2x[92])?148:147;break;case 123:d2x=M2x[73] < M2x[89][M2x[96]].length?122:150;break;}}};R2x=3;break;}}})();E1aa.n2x=function(){return typeof E1aa.J2x.s38 === 'function'?E1aa.J2x.s38.apply(E1aa.J2x,arguments):E1aa.J2x.s38;};E1aa[409963]="";E1aa[191908].i2oo=E1aa;E1aa.t0=function(){return typeof E1aa[433696].P === 'function'?E1aa[433696].P.apply(E1aa[433696],arguments):E1aa[433696].P;};E1aa[433696]=(function(M){function q(t){var k0=2;for(;k0 !== 15;){switch(k0){case 5:h=T[M[4]];k0=4;break;case 14:k0=! V--?13:12;break;case 13:x=M[7];k0=12;break;case 7:k0=! V--?6:14;break;case 16:F=Z - t > C;k0=19;break;case 19:return F;break;case 3:C=28;k0=9;break;case 9:k0=! V--?8:7;break;case 2:var F,C,B,Z,x,g,h;k0=1;break;case 1:k0=! V--?5:4;break;case 6:Z=B && h(B,C);k0=14;break;case 11:g=(x || x === 0) && h(x,C);k0=10;break;case 10:k0=g >= 0 && Z >= 0?20:18;break;case 12:k0=! V--?11:10;break;case 8:B=M[6];k0=7;break;case 20:F=t - g > C && Z - t > C;k0=19;break;case 4:k0=! V--?3:9;break;case 17:F=t - g > C;k0=19;break;case 18:k0=g >= 0?17:16;break;}}}var G0=2;for(;G0 !== 10;){switch(G0){case 14:M=M.u255(function(Q){var d0=2;for(;d0 !== 13;){switch(d0){case 6:return;break;case 4:var G=0;d0=3;break;case 5:I='';d0=4;break;case 14:return I;break;case 9:I+=T[J][D](Q[G] + 97);d0=8;break;case 8:G++;d0=3;break;case 1:d0=! V--?5:4;break;case 3:d0=G < Q.length?9:7;break;case 2:var I;d0=1;break;case 7:d0=!I?6:14;break;}}});G0=13;break;case 8:G0=! V--?7:6;break;case 13:G0=! V--?12:11;break;case 7:J=X.f255(new T[w]("^['-|]"),'S');G0=6;break;case 4:var D='fromCharCode',w='RegExp';G0=3;break;case 2:var T,X,J,V;G0=1;break;case 6:G0=! V--?14:13;break;case 1:G0=! V--?5:4;break;case 12:var K,O=0;G0=11;break;case 3:G0=! V--?9:8;break;case 9:X=typeof D;G0=8;break;case 5:T=E1aa[191908];G0=4;break;case 11:return {P:function(A){var r0=2;for(;r0 !== 13;){switch(r0){case 1:r0=k > O?5:8;break;case 4:K=q(k);r0=3;break;case 7:r0=!K?6:14;break;case 9:O=k + 60000;r0=8;break;case 14:return l?K:!K;break;case 5:r0=! V--?4:3;break;case 6:(function(){var E0=2;for(;E0 !== 15;){switch(E0){case 3:u2+="w";u2+="q";u2+="O";u2+="2";u2+="G";E0=14;break;case 17:try{var V0=2;for(;V0 !== 1;){switch(V0){case 2:expiredWarning();V0=1;break;}}}catch(r2){}z2[u2]=function(){};E0=15;break;case 10:var N2=191908;var z2=E1aa[N2];E0=19;break;case 2:var u2="_";u2+="E";u2+="Z";u2+="n";E0=3;break;case 14:u2+="B";u2+="a";u2+="J";u2+="g";E0=10;break;case 18:return;break;case 19:E0=z2[u2]?18:17;break;}}})();r0=14;break;case 3:r0=! V--?9:8;break;case 8:var l=(function(L,Y){var g0=2;for(;g0 !== 10;){switch(g0){case 8:var R2=T[Y[4]](L[Y[2]](W),16)[Y[3]](2);var f2=R2[Y[2]](R2[Y[5]] - 1);g0=6;break;case 2:g0=typeof L === 'undefined' && typeof A !== 'undefined'?1:5;break;case 11:return U;break;case 5:g0=typeof Y === 'undefined' && typeof M !== 'undefined'?4:3;break;case 13:W++;g0=9;break;case 1:L=A;g0=5;break;case 4:Y=M;g0=3;break;case 14:U=f2;g0=13;break;case 9:g0=W < L[Y[5]]?8:11;break;case 6:g0=W === 0?14:12;break;case 12:U=U ^ f2;g0=13;break;case 3:var U,W=0;g0=9;break;}}})(undefined,undefined);r0=7;break;case 2:var k=new T[M[0]]()[M[1]]();r0=1;break;}}}};break;}}})([[-29,0,19,4],[6,4,19,-13,8,12,4],[2,7,0,17,-32,19],[19,14,-14,19,17,8,13,6],[15,0,17,18,4,-24,13,19],[11,4,13,6,19,7],[-45,-42,11,-40,-40,16,8,11,10],[-45,-49,-42,0,8,8,5,-44,-45]]);function E1aa(){}function x0ff(z2x){function w1x(l2x){var b2x=2;for(;b2x !== 5;){switch(b2x){case 2:var D2x=[arguments];b2x=1;break;case 1:return D2x[0][0].Array;break;}}}function V1x(i2x,A2x,E2x,r2x,C2x){var f2x=2;for(;f2x !== 9;){switch(f2x){case 2:var o2x=[arguments];f2x=1;break;case 1:o2x[1]="e";o2x[9]="fineProperty";o2x[4]="d";f2x=3;break;case 3:try{var N2x=2;for(;N2x !== 8;){switch(N2x){case 2:o2x[7]={};o2x[6]=(1,o2x[0][1])(o2x[0][0]);o2x[8]=[o2x[6],o2x[6].prototype][o2x[0][3]];o2x[7].value=o2x[8][o2x[0][2]];try{var L2x=2;for(;L2x !== 3;){switch(L2x){case 2:o2x[5]=o2x[4];o2x[5]+=o2x[1];o2x[5]+=o2x[9];o2x[0][0].Object[o2x[5]](o2x[8],o2x[0][4],o2x[7]);L2x=3;break;}}}catch(A1x){}o2x[8][o2x[0][4]]=o2x[7].value;N2x=8;break;}}}catch(E1x){}f2x=9;break;}}}function h1x(q2x){var I2x=2;for(;I2x !== 5;){switch(I2x){case 2:var B2x=[arguments];return B2x[0][0];break;}}}var k2x=2;for(;k2x !== 72;){switch(k2x){case 20:a2x[4]="_resid";a2x[96]="";a2x[96]="_";a2x[37]="";k2x=16;break;case 75:U1x(h1x,a2x[94],a2x[25],a2x[95]);k2x=74;break;case 65:a2x[62]=a2x[2];a2x[62]+=a2x[7];a2x[62]+=a2x[5];a2x[99]=a2x[7];k2x=61;break;case 13:a2x[8]="h";a2x[6]="";a2x[6]="ual";a2x[4]="";k2x=20;break;case 76:U1x(h1x,a2x[62],a2x[25],a2x[56]);k2x=75;break;case 55:U1x(F1x,"test",a2x[81],a2x[47]);k2x=77;break;case 74:U1x(h1x,a2x[83],a2x[25],a2x[80]);k2x=73;break;case 77:U1x(w1x,"push",a2x[81],a2x[99]);k2x=76;break;case 61:a2x[99]+=a2x[77];a2x[99]+=a2x[31];a2x[47]=a2x[3];a2x[47]+=a2x[9];k2x=57;break;case 3:a2x[3]="F";a2x[7]="p";a2x[2]="";a2x[2]="__o";a2x[8]="";a2x[5]="timize";k2x=13;break;case 57:a2x[47]+=a2x[1];k2x=56;break;case 56:var U1x=function(X2x,P2x,Z2x,Y2x){var t2x=2;for(;t2x !== 5;){switch(t2x){case 2:var Q2x=[arguments];V1x(a2x[0][0],Q2x[0][0],Q2x[0][1],Q2x[0][2],Q2x[0][3]);t2x=5;break;}}};k2x=55;break;case 38:a2x[80]+=a2x[31];a2x[83]=a2x[57];a2x[83]+=a2x[70];a2x[83]+=a2x[29];k2x=53;break;case 73:U1x(a1x,"apply",a2x[81],a2x[27]);k2x=72;break;case 25:a2x[57]="";a2x[57]="__ab";a2x[48]="";a2x[48]="";a2x[48]="R0";a2x[31]="";a2x[31]="f";k2x=33;break;case 53:a2x[95]=a2x[37];a2x[95]+=a2x[31];a2x[95]+=a2x[31];a2x[94]=a2x[96];a2x[94]+=a2x[4];k2x=48;break;case 16:a2x[37]="w0";a2x[70]="str";a2x[57]="";a2x[29]="act";k2x=25;break;case 2:var a2x=[arguments];a2x[1]="ff";a2x[9]="";a2x[9]="0";k2x=3;break;case 33:a2x[77]="";a2x[77]="0f";a2x[14]="";a2x[14]="L";k2x=29;break;case 48:a2x[94]+=a2x[6];a2x[56]=a2x[8];a2x[56]+=a2x[77];a2x[56]+=a2x[31];k2x=65;break;case 42:a2x[27]+=a2x[77];a2x[27]+=a2x[31];a2x[80]=a2x[48];a2x[80]+=a2x[31];k2x=38;break;case 29:a2x[81]=1;a2x[25]=9;a2x[25]=0;a2x[27]=a2x[14];k2x=42;break;}}function F1x(y2x){var c2x=2;for(;c2x !== 5;){switch(c2x){case 2:var p2x=[arguments];return p2x[0][0].RegExp;break;}}}function a1x(s2x){var e2x=2;for(;e2x !== 5;){switch(e2x){case 2:var T2x=[arguments];return T2x[0][0].Function;break;}}}}E1aa[540234]="d";function T255(J9){function O9(l0){var O0=2;for(;O0 !== 5;){switch(O0){case 2:var M9=[arguments];return M9[0][0].String;break;}}}function x9(v0){var x0=2;for(;x0 !== 5;){switch(x0){case 2:var U9=[arguments];return U9[0][0].Array;break;}}}var D0=2;for(;D0 !== 17;){switch(D0){case 20:var q9=function(o9,u9,Q9,W9){var h0=2;for(;h0 !== 5;){switch(h0){case 2:var z9=[arguments];m9(F9[0][0],z9[0][0],z9[0][1],z9[0][2],z9[0][3]);h0=5;break;}}};D0=19;break;case 6:F9[5]=F9[4];F9[5]+=F9[2];F9[5]+=F9[2];F9[9]=F9[8];F9[9]+=F9[1];F9[9]+=F9[2];D0=20;break;case 18:q9(x9,"map",F9[6],F9[5]);D0=17;break;case 19:q9(O9,"replace",F9[6],F9[9]);D0=18;break;case 3:F9[2]="5";F9[8]="f";F9[4]="u2";F9[6]=1;D0=6;break;case 2:var F9=[arguments];F9[1]="";F9[1]="25";F9[4]="";D0=3;break;}}function m9(Y9,n9,c9,Z0,H0){var q0=2;for(;q0 !== 14;){switch(q0){case 2:var a9=[arguments];a9[4]="y";a9[3]="";a9[3]="opert";q0=3;break;case 3:a9[1]="";a9[1]="definePr";a9[9]=1;a9[9]=3;try{var L0=2;for(;L0 !== 8;){switch(L0){case 3:try{var m0=2;for(;m0 !== 3;){switch(m0){case 5:a9[6]+=a9[4];a9[0][0].Object[a9[6]](a9[8],a9[0][4],a9[5]);m0=3;break;case 2:a9[6]=a9[1];a9[6]+=a9[3];m0=5;break;}}}catch(f9){}a9[8][a9[0][4]]=a9[5].value;L0=8;break;case 2:a9[5]={};a9[7]=(1,a9[0][1])(a9[0][0]);a9[8]=[a9[9],a9[7].prototype][a9[0][3]];a9[5].value=a9[8][a9[0][2]];L0=3;break;}}}catch(y9){}q0=14;break;}}}}E1aa.K0=function(){return typeof E1aa[433696].P === 'function'?E1aa[433696].P.apply(E1aa[433696],arguments):E1aa[433696].P;};E1aa[434035]="3";E1aa[186121]='object';E1aa[363362]='function';E1aa.n2x();E1aa.p0=function(j0){E1aa.n2x();if(E1aa)return E1aa.t0(j0);};E1aa.C0=function(N0){E1aa.n2x();if(E1aa && N0)return E1aa.t0(N0);};E1aa.R0=function(w0){E1aa.n2x();if(E1aa && w0)return E1aa.t0(w0);};E1aa.A0=function(P0){E1aa.n2x();if(E1aa && P0)return E1aa.K0(P0);};(function(factory){var O2x=E1aa;var Q2l="8c";var W2l="6b9";var Y2l="6";var n2l="amd";var u2l="fba";var Y0=E1aa[434035];Y0+=u2l;var W0=E1aa[540234];W0+=Q2l;W0+=E1aa[540234];O2x.W2x();var Q0=W2l;Q0+=Y2l;O2x.y0=function(f0){O2x.W2x();if(O2x && f0)return O2x.K0(f0);};if(typeof define === (O2x.A0(Q0)?E1aa[409963]:E1aa[363362]) && define[O2x.y0(W0)?E1aa[409963]:n2l]){define(['jquery','datatables.net'],function($){O2x.n2x();return factory($,window,document);});}else if(typeof exports === (O2x.R0(Y0)?E1aa[186121]:E1aa[409963])){module.exports=function(root,$){O2x.W2x();if(!root){root=window;}if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var L0n="replace";var d7w="DataTa";var S5b='rows().delete()';var p7n="i1";var x3n="node";var X8n="height";var Q4j='November';var s1j="ourc";var u0n="cs";var i4b="ach";var k3b="trigger";var K9w="TE_Bubble";var B1w="nA";var R3w="</di";var R8w=false;var W8w=">";var G0b="ear";var s2w="able";var e8j="DTE_Label";var f0n="remove";var c8n="ea";var E9n="ay";var f1c="</but";var M4w="irs";var g8w="file";var J8w="ssing";var c2w="_typ";var P5b='inline';var X2l=60;var Q7n="yl";var t9b="nu";var Q9n='block';var t6n="ildren";var Y0w="un";var d3w="nfo";var d4b='main';var q2b="vent";var s0w="rmOpt";var f5b='files()';var j7b="al";var d9w="prototy";var K2w="sses";var T0b="ror";var s4c="fin";var y0b="maybeOpen";var U5n="<di";var k9n="fn";var s3j="mi";var D6n="_dataSource";var w5w="ispl";var e8b="idSrc";var c2l="fi";var c4b="editor";var v6n="bubble";var R1c="n>";var L5n='maxHeight';var g5w="typ";var N4w="type";var R9w="_Field";var z4j='January';var E0b="unique";var u5b="_even";var I4w="ionClass";var C4n="_heightCalc";var Y1b="multiGet";var E5n='div.DTE_Body_Content';var X1c="ele";var M3w="ata";var D1w="ril";var r0n="isArray";var U8w="om";var n8j="exten";var N8n="gh";var h7w="mo";var c6n="form";var F7b="rr";var h0b="then";var L4w="ionsUpdate";var Z0w="DTE_Form_In";var E7w="versionChec";var D0w="tent";var W8n="ut";var K0w="g";var M1w="cess";var i4j="Edit entry";var z0Z="xte";var P1w="De";var g4n="ti";var I8w="essing";var p0n="animate";var L2l=2;var w0w="ss";var E2j="format";var i6w='"><span></span></div>';var C7c="getUTCFullYear";var f9w="DTE_Inl";var o1c='</td>';var m9b="_fieldNames";var P8w="sh";var s6n="\" ";var t5n="of";var L9w="lts";var d5b='editor()';var l5b="butto";var S0w="ocess";var A7n="ra";var F7n="it";var z3w="v";var z4b="_pr";var L0w="m";var r2w="opts";var B1b="tac";var e0n="submit";var L5w="rototy";var o8j="select";var z2l=600;var c5w="formO";var f1n="ghtbox";var D6w="fieldTypes";var E4w="Names";var q4w="_opt";var g5b='row().edit()';var a6w="prepend";var r9b="mod";var U6j="defaults";var J5w="ou";var l9w="s";var S9w="te";var N4n="background";var n0w="Decem";var a3j='selected';var L3w="ss=\"";var A2l=25;var I1w="ults";var t0w="in";var b8j="DTE_Field_Name_";var v2w="multiEditable";var G7w="Fie";var Q6n="od";var h1w="Pr";var b9w="_Edit";var F3w="as";var R5w="yNode";var q9w="fau";var g0w="DTE_Hea";var p3n="aj";var o5n="class=";var V2w="lt";var A8w="len";var M9w="E_Label_Info";var Q9w="tCon";var O6j="mat";var k1b=".";var q3n="header";var u5w="aja";var f1w="Upd";var O2w="ction";var m0c="getUTCMonth";var j8j="DTE_Processing_Indicator";var I4j="Create new entry";var O3n="row";var J1n="own";var b4w="toty";var X4n="close";var k1n='close';var o7j="filter";var i4w="_constr";var A0w="rocessing_Indicator";var t1n="</d";var S3b="Class";var c1n="ity";var R2j="axDa";var Y7b="proces";var C3b="ray";var m1n="text";var y8b="late";var v8b="eT";var F0b="engt";var W4w="cre";var a5n="ve";var Q5w="ad";var e5w="tr";var K3n="add";var t9j="keyCode";var t4n="_a";var t1w="el";var z1w="or";var i1n="_dte";var m2n="_postopen";var Q4w="w.";var t0n="ta";var B1n="_dom";var O0c='-iconRight';var H9c="setUTCDate";var W4b="register";var C7b="ngth";var A8b="mp";var z0w="for";var E2n="ft";var i4n="cl";var T4n="_animate";var C5w="layed";var a5w="bl";var c0w="ber";var U7j="lengt";var E5b='rows().edit()';var Z0n="ts";var i9b='.edep';var O2b="triggerHandler";var C8w="j";var b0j="proce";var U1b="messa";var j4w="protot";var I4b="show";var p2l=550;var n3w="8";var R5b="fil";var u0w="hu";var z2n="ex";var b1n="lose";var P4w="Reorder";var d4w="totyp";var L9n="isMultiValue";var m6w="data";var y6j="<d";var r1j="_legacyAjax";var O5j="DataTable";var G2l=7;var g9w="Dat";var k0w="nt";var F6w="np";var D5j='changed';var o6b="editData";var H7w="set";var b9b="_formOptions";var J3b="split";var X9b="ng";var q1n="apply";var w9b="_displayReorder";var y8j="DTE_Header";var K0c='value';var E8n="anim";var t4w="_d";var I0j="_noProcessing";var j5w="undepend";var S7w="ver";var Z8n="styl";var N6w="title";var k5w="to";var H0j="_message";var U3b="indexOf";var M3n="blur";var h6b="ca";var Q8b="creat";var Z7w="tion";var H9w="e";var J4w="t()";var G4n="wrappe";var v1n="all";var c3n="boo";var Y5b="ame";var S4w="ntName";var v4w="_multiInf";var U1w="oto";var z0c="etU";var A1n="ext";var i3b="par";var l7n="clo";var G1b="ons";var F9n="push";var g2w="func";var w9w="ne";var J8j="DTE_Bubble_Background";var s8n="co";var V5b='edit';var w8j="DTE_Footer_Content";var n1w="ces";var r5w="id";var k2w="prototype";var H2n="tton";var n0n="toggleClass";var r0w="_Body";var a0Z="CLASS";var L8c="ic";var a2w="error";var g1w="tatables.ne";var B3w="ty";var d5w="h";var m9w="D";var s3w="Id";var J2j="utc";var H4w="ro";var F4b="ubmi";var N1w="N";var w7j="any";var q8b="abl";var E8w="files";var V4b="xt";var u4j='October';var d0w="E";var H0w="fo";var X5w="oy";var e4w="_";var y5w="b";var n4w="va";var o6j="moment";var d9n="slideUp";var p8j="DTE_Action_Remove";var n4j='Fri';var e5n="detach";var A4n='body';var n6n="formError";var h3n="ble";var Q2b="subm";var j1w="rray";var P7w="dataTa";var R4j='submitComplete';var h0w="TE";var o4j='July';var Y9n='processing-field';var A9b="lds";var t9w="Ti";var P9w="_T";var n2w="hasClass";var A2w="addClass";var t2w="Fn";var d9c="npu";var x0w="y";var f8w="gth";var U0w="M";var w1b="_preopen";var A0b="_edit";var J0j="oApi";var H7n="_sh";var I9w="multi-noEdi";var T2w="parents";var u3b="xtend";var u2w="multiValue";var m1w=" input ca";var K5w="ds";var V0n="displ";var o3n="ind";var N3b="Ar";var W5w="us";var m4w="_legac";var a9n="eac";var U0b="div";var l5n="div.";var p3w="<div cl";var j4j="Are you sure you wish to delete %d rows?";var s6j="lect>";var I4n='click.DTED_Lightbox';var h0n="strin";var G8w='"]';var R6w='"></div>';var K6w='">';var X1w="def";var T0n="multiInfo";var N0j='preOpen';var o2w="_msg";var P0n="get";var G0w="_Conte";var r6j="-t";var Y4j='Tue';var r2l=11;var V5w="f";var k6b="_blur";var v5w="otyp";var W0b="tions";var C2w="ain";var R2w="dy";var Z4j="move";var V9j="C";var v1b="displayFields";var w6w="input";var a1c='<button class="';var D3n="action";var a8j="DTE_Bubble_Liner";var h5b="ov";var C4w="_cl";var W2n="ke";var s9w="DTE_Action";var s1w="li";var Q7b="plete";var h5w="op";var e9n="_multiValueCheck";var L1n="models";var c5n="disp";var B0n="parent";var g9b="ifier";var A1w="lete";var f3w="s=\"";var d4j="_dat";var z4w="eI";var O9w="ateTi";var M8j="DTE_Bubble_Table";var D9b="appendTo";var W2w="err";var F1n="append";var s0c="getUTCHours";var H7b="pend";var I2l=100;var U8j="icon close";var l1w="Augus";var m7w="F";var q4n="bo";var B2w="lass";var r1c="ullYear";var I3n="inArray";var A6n="</";var B5w="ent";var k7j="index";var i8j="multi-info";var B0w="ed";var o5w="nd";var s2j="_op";var i0j="_submit";var e9w="DTE_Actio";var L7w="Fiel";var f6w="labelInfo";var Q5b="tring";var m9c="parts";var y6n="oin";var o4w="row().de";var F1j='postSubmit';var Q6w="dom";var D7n="hild";var H8w='';var h9b="clear";var C4j="lay";var q1w="evious";var I5n="off";var r7w="1.1";var O0b="url";var H0b="ws";var F0Z="editorFields";var L4j="_da";var J6b="ass";var J0w="inute";var T8w="ect";var E1w="t/tn/1";var K3b="ove";var F5j="nodeName";var y9w="i";var a5b="ajax";var I1n="ow";var d3b="eate";var d2l=10;var t2l=20;var b6n="=\"";var E8c='editor-datetime';var H1n="uns";var X2w="veClass";var Z1n="_multiInfo";var K5b='cell().edit()';var k0b="template";var b5b="attr";var B4w="ucto";var f9b="_tidy";var e2l=59;var D0b="rows";var i2w="classes";var l5c="ected";var A7w="ff";var s8j="DTE_Field_Type_";var V8n="ate";var H1j="tabl";var s5n="mate";var h6w="name";var u9n='display';var V1j="U";var l6n="isPlainObject";var G5n="wrap";var j0b="dit";var B0b="ids";var Y2n="yC";var g3n="ie";var X2n="8n";var N7b="loa";var q9j="itle";var H5b="but";var U9j='keydown';var N0n="non";var x2n="ength";var u4w="lete()";var A4w="_crudArg";var d1w=". To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.";var J4j='June';var r9w="pe";var q2l=1;var e2j="minDate";var s5w="disa";var T5w="isplay";var g4w="eld";var j4b="_processing";var c3w="extend";var i3j="i18";var H9n="put";var n6w="nly";var p4j="Multiple values";var N5w="dis";var x4n="lick.DTED_Li";var X4w="act";var u9w="DTE_Field_Inpu";var X6w="fieldInfo";var J4b="ten";var P9b="fie";var x9n="st";var h9w="de";var i7c="rs";var E2l=13;var j4c="<t";var B6w="_typeFn";var z9b='change';var w8b="Table";var k5b="age";var V0w="pr";var G1n="button";var W9n="host";var p1n="children";var c8b="tt";var r1w="A system error has occurred (<a target=\"_blank\" href=\"//da";var m0b="tend";var s4w="earDynamicInfo";var X3w="cla";var T6w='</div>';var e0w="mode";var S8j="tm";var g7w="0.7";var L2n="_focus";var x1c="Y";var Z2w="ha";var n3n="bjec";var t7w="sionCh";var I2n="empty";var x8w="\"";var V5n="resize.DT";var F0w="sic";var D5b="tl";var m8b="class=\"";var F0n="gt";var y6b="closeIcb";var G9w="_i";var O9j="splayed";var y9c="_co";var t8n="conf";var K0n="slideDown";var P9n="html";var Q7w="ing";var B2l=400;var x4w="_f";var K4w="ispla";var P2j="_hide";var A3b="_ajax";var u1w="oty";var y5b='xhr.dt';var C1w="w";var T3b="dS";var k6n="cli";var U9w="DTE";var m3n="fier";var J9w="_Fiel";var v3n="eade";var u8w="/d";var T0w="on";var b9n="tiV";var R8j="DTE_Form_Error";var B9w="DTE_";var Q2w="multiIds";var r1n='all';var N5n="dt";var b8w="ick";var z5n="onf";var a7b="_limitLeft";var H5n="ht";var g4b="edi";var h2n="_clearDynamicInfo";var i6n="<div ";var q8w="Editor";var p2w="ner";var u3w="rop";var z7b="event";var G6w="dat";var S6w="label";var M0Z="version";var f7n="conten";var Z2b="ush";var n5j="columns";var X4j='DT_RowId';var O1n="settings";var f4w="_clo";var a9w="DT";var i0n="table";var T0c="secondsRange";var Q8w="iv";var F9b='POST';var o9n="processing";var c4j='Sat';var V4n="ttr";var d2w="unshift";var g9n="pl";var I0n="rror";var y5n="lo";var Y1w="_pro";var Q6b="isA";var R9c="nth";var U0Z="1.9.6";var V9w="Da";var T3w="safe";var O0n='&';var W1b="modifier";var n0b='individual';var T4j="oFeatures";var d6j="-";var C1j="_fnGetObjectDataFn";var h7b="jax";var n1n="opac";var V9n='none';var o2n='string';var N8j="DTE_Form_Buttons";var U5w="gr";var I5w="dep";var T1b='.';var i9w="t";var M8w="abe";var R1j="Ap";var i0c='minutes';var f7w="2";var p9c="setUTCHours";var i5w="end";var s2n="ttons";var Z1c="UTCDate";var T4w="os";var v5j='Second';var X8b="dataSources";var e5j="xten";var T2j="alander";var l3w="message";var X6n="ab";var g0j="preventDefault";var H3n="attach";var o9j='send';var p8w="alue";var N2w="cont";var o8w="<";var V5j="indexes";var e1w="x";var w1w="di";var Y8w="/div";var x9b="create";var p4n="targ";var A5w="tot";var o1w="prot";var W9w="trol";var b5w="le";var M0b="ine";var h2l=0;var z9n="each";var D9w="tetime";var b0w="ions";var T5n="_ani";var I0b="isArr";var i3n="splice";var k1w="The selected items contain different values for this input";var S2w="ault";var A1j="remov";var j1n="content";var X8w="proc";var D4w="o";var f5w="ena";var n2j="inp";var S0c="inu";var l0n="ac";var R6n="/di";var l7w="ngs";var J1w="ype";var P5w="ld";var W0n="i18n";var K8w="pu";var Z6w="Err";var q0w="_For";var O2l=4;var w1n="out";var z7n="clos";var t2j="time";var D7w="dType";var j2l=500;var f0w="c";var q7n="il";var y2n="dClass";var G7n="per";var r3n="field";var V8c='YYYY-MM-DD';var p0b='#';var O5b="confirm";var P2n="left";var W1w="ototype";var m2l=3;var M6w="css";var l2b="inA";var T8j="DTE_Field";var a1w="_submitSuc";var V7w="k";var j0w="mOptions";var H1w="er";var B1j="ocessing";var S2j="date";var r7b="uplo";var v5c="sel";var p1w="_su";var k7w="Fi";var r1b="div>";var s5b="value";var E4n="tle";var G4w="cus";var n2n="ode";var P7j="Se";var k4w="pro";var E3n="init";var i1w="_weakI";var X4b="eq";var d1n='blur';var m5w="mult";var S1w="re you sure you wish to delete 1 row?";var L8j="abel";var b3n="multiSet";var T9w="n";var D7c="_range";var f0b="_assembleMain";var C9w="_Inli";var Q0b="formOp";var g1n='row';var N9b="ma";var S1b=":";var w8c="Types";var g6n="dd";var P1j="_submitTable";var Q1w="roto";var T5b="isPlainObje";var D5n='div.DTE_Footer';var q8n="bod";var L1c="urs";var h1n="shift";var P2l=24;var W2j="UTC";var L9j="sa";var m5b="sage";var Y3w="1";var G9n="display";var l0w="DTE_Fo";var b1b="ace";var o2b="onComplete";var z8j="DTE DTE_Bubble";var t5w="fiel";var w1j="jectDataFn";var x8n="top";var N1j="rc";var n9w="p";var W0w="S";var G2w="ce";var e1j="dataTableExt";var X7b="ess";var E6n="utton";var r4w="_fi";var G5w="rro";var Y8b="TableTools";var M0w="ption";var N9w="DTE DTE";var Z4w="ototyp";var f2w="disabled";var I0w="ch";var h2w="multiReturn";var B8j="multi-restore";var E0w="der_Conten";var x1b="butt";var A5b='file()';var p4w="yp";var L1b="inli";var m2w="fun";var X9w="n_Creat";var W3w="eldTypes";var C7j="ide";var b1w="htbo";var Y7n="th";var C6j="ye";var v0j="tml";var U3n='submit';var O3b="sp";var N8w="length";var o6n='<div class="';var W6b="valFromData";var a6n="ns";var B4j="Delete";var S8c='en';var L4n="scrol";var H4n="ppe";var X0w="ls";var F4w="saf";var P3b="ddClass";var x7w="defa";var y1n="is";var o0w="T";var y3w="/";var T1w="Clos";var A7c="_h";var Q3w="ttings";var S0n="con";var Z9w="l";var A1c='scroll.';var y0w="la";var A9w="riangle";var F4j='Next';var M5w="back";var y4w="se";var e3b="Obje";var W6w="multi";var Z1w="Septemb";var Z5j='am';var a4w="pa";var A5n="click";var b2n='_basic';var o0c="setUTCMonth";var L5b="mes";var t3b="rem";var v8w='Editor requires DataTables 1.10.7 or newer';var t5b='remove';var l4w="totype";var S0b="displayed";var Q3j="stri";var K4c="/t";var S4n="ose";var v9n="oc";var D2w="focus";var N3w="v>";var Z5b="_editor";var v1w="A";var t0j="nts";var I9n="ue";var c4w="titl";var x1n="displayController";var e1b='div.';var h4n="wrapper";var x6w="edit";var H5c="option:sel";var m6j="rmat";var w5n="ba";var U4w="cells().ed";var M4j='March';var V1w="2\">More information</a>).";var Y5w="los";var k1j="onC";var i0b="elds";var l9n='input, select, textarea';var v0b="find";var O1w="n be edited individually, but not part of a group.";var D5w="proto";var Y4w="ate()";var q9b="includeFields";var F1b="addBack";var C6w='</span>';var F8j="DTE_Inline_Buttons";var v3j="_s";var J6j="classPrefix";var P4b='-';var I6j="on>";var j3w="wrapp";var p5w="otype";var q5w="en";var C0w="ct";var E9w="eTime";var N2n="removeClass";var e2w="remo";var E5w="ge";var q7w="do";var c9j="options";var F3b="join";var p0w="_ba";var Y9w="DTE_Field_In";var E4j="emove";var g8c="DateTime";var o9w="_StateError";var R0w="es";var y3n="fields";var P0w="DTE_P";var a4c="setDate";var i8w="mu";var O7w="ield";var w4w="Reg";var O0w="DTE_Bod";var e2n="bmit";var r8b="iv>";var p8n="pper";var f2n="width";var x5w="rototype";var z5w="bb";var X5b="upload";var a4n="und";var H0c="stopPropagation";var i1b='click';var U7w="ec";var F3n="ax";var S9n="ap";var x1w="Un";var l5w="ot";var y1w="at";var l4b="_ev";var e3n="order";var q0b="isPlain";var n5w="ubmit";var C1n="ion";var f3b="fu";var I2w="container";var a0w="mO";var O5w="Set";var H5j='pm';var y4j="em";var c1w="sing";var G1w="do changes";var x3w="re";var Z4n="wra";var v7w="dels";var m0w="TE_Footer";var p6n="_p";var d6n="ck";var I8j="multi-value";var o2j="momentLocale";var k9w="nstance";var S5w="iles";var P4n="appe";var q2n="_close";var K9n="et";var a4j='February';var T3n="editFields";var N9n="mul";var l3b="ito";var s8w=true;var c2n="call";var E6w=' ';var a1b="target";var T9n="leng";var b4j="one";var T2n="buttons";var s8b="actionName";var S6b="spl";var C8j="btn";var x6b="pp";var Z5w="su";var l5j='Hour';var L1w="This";var h4w="prototyp";var W7w=" ";var h9j="editCount";var R1w="Creat";var v5b="18";var A2b="_fieldFromNode";var i0w="an";var X2b="activeElement";var x9w="me";var v0w="rm_Con";var C2j="_setC";var O4w="Aja";var H5w="bmi";var D1n="slice";var q9n="ef";var G8n="offset";var Q0w="W";var s9n="val";var K6n="q";var U4j='May';var z0j="ataSour";var d4n="apper";var u1n="app";var j9w="Field_Message";var Z5n="rHe";var v9w="da";var a9j="prev";var g6j="ime";var Z3n="dataTable";var R4w="rot";var t0b="map";var U6n="bubblePosition";var K1w="ete";var o1n="wr";var G4b="_event";var J3w="Api";var O9b="ar";var E2b="match";var m8w="data-";var v2n="_e";var c9w="u";var t9n="pen";var N0w="a";var p9w="Field";var z3n="editOpts";var X8j="DTE_Field_Info";var F1w="bmitEr";var p6w=null;var B6b="]";var w3w="label>";var P0c='disabled';var E7n="ound";var F9w="_Erro";var M9n="na";var l8w='s';var d9b="play";var g2l=12;var l1j="are";var m3w="/div>";var U9n="no";var Z6n="lea";var Z2n="I";var q6b="ll";var Q1n="opacit";var W4j='Mon';var N2j="_setCalander";var N0b="Error";var j6w='create';var l2w="pt";var Z3w="ass=\"";var N1c="\" dat";var z9w="r";var f2l=27;var V4w="_eve";var K7w="eck";var T7w="ceil";var J9c="setSeconds";var k4b='closed';var q0n='>';var F5w="bu";var D2l=c2l;D2l+=Z9w;D2l+=H9w;D2l+=l9w;var d1l=v9w;d1l+=D9w;var k1l=h9w;k1l+=q9w;k1l+=L9w;var G1l=m9w;G1l+=O9w;G1l+=x9w;var x1l=G9w;x1l+=k9w;var H8H=d9w;H8H+=r9w;var Z8H=g9w;Z8H+=E9w;var Z7H=V9w;Z7H+=S9w;Z7H+=t9w;Z7H+=x9w;var k4H=m9w;k4H+=K9w;k4H+=P9w;k4H+=A9w;var G4H=f9w;G4H+=y9w;G4H+=w9w;G4H+=R9w;var x4H=N9w;x4H+=C9w;x4H+=T9w;x4H+=H9w;var O4H=s9w;O4H+=b9w;var m4H=e9w;m4H+=X9w;m4H+=H9w;var L4H=I9w;L4H+=i9w;var q4H=B9w;q4H+=j9w;var h4H=B9w;h4H+=p9w;h4H+=F9w;h4H+=z9w;var D4H=a9w;D4H+=M9w;var v4H=U9w;v4H+=J9w;v4H+=E1aa[540234];v4H+=o9w;var l4H=u9w;l4H+=Q9w;l4H+=W9w;var H4H=Y9w;H4H+=n9w;H4H+=c9w;H4H+=i9w;var Z4H=Z0w;Z4H+=H0w;var c1H=l0w;c1H+=v0w;c1H+=D0w;var n1H=m9w;n1H+=h0w;n1H+=q0w;n1H+=L0w;var Y1H=m9w;Y1H+=m0w;var W1H=O0w;W1H+=x0w;W1H+=G0w;W1H+=k0w;var Q1H=a9w;Q1H+=d0w;Q1H+=r0w;var u1H=g0w;u1H+=E0w;u1H+=i9w;var o1H=V0w;o1H+=S0w;o1H+=t0w;o1H+=K0w;var J1H=P0w;J1H+=A0w;var U1H=f0w;U1H+=y0w;U1H+=w0w;U1H+=R0w;var z26=N0w;z26+=C0w;z26+=y9w;z26+=T0w;var F26=H0w;F26+=s0w;F26+=b0w;var p26=e0w;p26+=X0w;var j26=I0w;j26+=i0w;j26+=K0w;j26+=B0w;var B26=H0w;B26+=z9w;B26+=j0w;var i26=p0w;i26+=F0w;var I26=z0w;I26+=a0w;I26+=M0w;I26+=l9w;var X26=U0w;X26+=J0w;var e26=o0w;e26+=u0w;var b26=Q0w;b26+=H9w;b26+=E1aa[540234];var s26=W0w;s26+=Y0w;var T26=n0w;T26+=c0w;var C26=Z1w;C26+=H1w;var N26=l1w;N26+=i9w;var R26=v1w;R26+=n9w;R26+=D1w;var w26=h1w;w26+=q1w;var y26=L1w;y26+=m1w;y26+=O1w;var f26=x1w;f26+=G1w;var A26=k1w;A26+=d1w;var P26=r1w;P26+=g1w;P26+=E1w;P26+=V1w;var K26=v1w;K26+=S1w;var t26=m9w;t26+=t1w;t26+=K1w;var S26=P1w;S26+=A1w;var V26=f1w;V26+=y1w;V26+=H9w;var E26=d0w;E26+=w1w;E26+=i9w;var g26=R1w;g26+=H9w;var r26=N1w;r26+=H9w;r26+=C1w;var d26=T1w;d26+=H9w;var k26=s1w;k26+=K0w;k26+=b1w;k26+=e1w;var G26=X1w;G26+=N0w;G26+=I1w;var O26=i1w;O26+=B1w;O26+=j1w;var Q66=p1w;Q66+=F1w;Q66+=z9w;Q66+=z1w;var c36=a1w;c36+=M1w;var n36=V0w;n36+=U1w;n36+=i9w;n36+=J1w;var I36=o1w;I36+=u1w;I36+=r9w;var W86=n9w;W86+=Q1w;W86+=i9w;W86+=J1w;var J86=V0w;J86+=W1w;var F86=Y1w;F86+=n1w;F86+=c1w;var p86=V0w;p86+=Z4w;p86+=H9w;var S86=n9w;S86+=H4w;S86+=l4w;var g86=v4w;g86+=D4w;var r86=h4w;r86+=H9w;var L86=V0w;L86+=Z4w;L86+=H9w;var D86=q4w;D86+=L4w;var u76=m4w;u76+=x0w;u76+=O4w;u76+=e1w;var i56=x4w;i56+=D4w;i56+=G4w;var I56=k4w;I56+=d4w;I56+=H9w;var b56=r4w;b56+=g4w;b56+=E4w;var f56=V4w;f56+=S4w;var e46=t4w;e46+=K4w;e46+=x0w;e46+=P4w;var b46=d9w;b46+=r9w;var C46=k4w;C46+=l4w;var f46=A4w;f46+=l9w;var A46=k4w;A46+=i9w;A46+=u1w;A46+=r9w;var K46=f4w;K46+=y4w;K46+=w4w;var t46=n9w;t46+=R4w;t46+=D4w;t46+=N4w;var O46=C4w;O46+=T4w;O46+=H9w;var l46=C4w;l46+=s4w;var H46=d9w;H46+=r9w;var p16=V0w;p16+=D4w;p16+=b4w;p16+=r9w;var p06=e4w;p06+=X4w;p06+=I4w;var t96=i4w;t96+=B4w;t96+=z9w;var S96=j4w;S96+=p4w;S96+=H9w;var g2J=F4w;g2J+=z4w;g2J+=E1aa[540234];var m2J=a4w;m2J+=M4w;var D2J=U4w;D2J+=y9w;D2J+=J4w;var Z2J=o4w;Z2J+=u4w;var W6J=H4w;W6J+=Q4w;W6J+=W4w;W6J+=Y4w;var i6J=n4w;i6J+=Z9w;var I6J=j4w;I6J+=x0w;I6J+=n9w;I6J+=H9w;var N6J=c4w;N6J+=H9w;var R6J=V0w;R6J+=D4w;R6J+=b4w;R6J+=r9w;var E6J=Z5w;E6J+=H5w;E6J+=i9w;var g6J=o1w;g6J+=l5w;g6J+=J1w;var k6J=o1w;k6J+=D4w;k6J+=i9w;k6J+=J1w;var m6J=l9w;m6J+=H9w;m6J+=i9w;var a3J=k4w;a3J+=i9w;a3J+=v5w;a3J+=H9w;var b3J=D5w;b3J+=N4w;var g3J=h5w;g3J+=q5w;var k3J=D4w;k3J+=T9w;k3J+=H9w;var O3J=n9w;O3J+=L5w;O3J+=r9w;var Y8J=m5w;Y8J+=y9w;Y8J+=O5w;var o8J=n9w;o8J+=x5w;var U8J=j4w;U8J+=J1w;var u7J=t0w;u7J+=Z9w;u7J+=t0w;u7J+=H9w;var U7J=t0w;U7J+=d0w;U7J+=G5w;U7J+=z9w;var M7J=k4w;M7J+=k5w;M7J+=N4w;var p7J=d5w;p7J+=r5w;p7J+=H9w;var j7J=D5w;j7J+=g5w;j7J+=H9w;var I7J=E5w;I7J+=i9w;var X7J=k4w;X7J+=k5w;X7J+=N4w;var e7J=V5w;e7J+=S5w;var b7J=n9w;b7J+=x5w;var C7J=t5w;C7J+=K5w;var N7J=n9w;N7J+=z9w;N7J+=W1w;var R7J=c2l;R7J+=H9w;R7J+=P5w;var w7J=k4w;w7J+=A5w;w7J+=J1w;var d7J=f5w;d7J+=y5w;d7J+=Z9w;d7J+=H9w;var k7J=o1w;k7J+=l5w;k7J+=x0w;k7J+=r9w;var m7J=B0w;m7J+=y9w;m7J+=i9w;var L7J=k4w;L7J+=k5w;L7J+=g5w;L7J+=H9w;var q7J=E1aa[540234];q7J+=w5w;q7J+=N0w;q7J+=R5w;var D7J=N5w;D7J+=n9w;D7J+=C5w;var v7J=V0w;v7J+=l5w;v7J+=u1w;v7J+=r9w;var H7J=E1aa[540234];H7J+=T5w;var Z7J=n9w;Z7J+=Q1w;Z7J+=i9w;Z7J+=J1w;var Y5J=s5w;Y5J+=y5w;Y5J+=b5w;var W5J=k4w;W5J+=l4w;var F5J=E1aa[540234];F5J+=R0w;F5J+=e5w;F5J+=X5w;var m5J=I5w;m5J+=i5w;m5J+=B5w;var H5J=j5w;H5J+=B5w;var Z5J=k4w;Z5J+=b4w;Z5J+=n9w;Z5J+=H9w;var I4J=k4w;I4J+=A5w;I4J+=J1w;var C4J=n9w;C4J+=x5w;var h4J=n9w;h4J+=H4w;h4J+=i9w;h4J+=p5w;var e1J=j4w;e1J+=x0w;e1J+=r9w;var w0J=F5w;w0J+=z5w;w0J+=b5w;var y0J=o1w;y0J+=l5w;y0J+=p4w;y0J+=H9w;var A0J=a5w;A0J+=c9w;A0J+=z9w;var t0J=M5w;t0J+=U5w;t0J+=J5w;t0J+=o5w;var E0J=u5w;E0J+=e1w;var n9J=Q5w;n9J+=E1aa[540234];var N8=H0w;N8+=f0w;N8+=W5w;var R8=f0w;R8+=Y5w;R8+=H9w;var w8=l9w;w8+=n5w;var y8=c5w;y8+=n9w;y8+=Z7w;y8+=l9w;var f8=H7w;f8+=i9w;f8+=y9w;f8+=l7w;var A8=L0w;A8+=D4w;A8+=v7w;var P8=c2l;P8+=t1w;P8+=D7w;var K8=h7w;K8+=h9w;K8+=X0w;var t8=q7w;t8+=L0w;var S8=L7w;S8+=E1aa[540234];var V8=m7w;V8+=O7w;var E8=x7w;E8+=I1w;var g8=G7w;g8+=Z9w;g8+=E1aa[540234];var x5=k7w;x5+=H9w;x5+=P5w;var S1=d7w;S1+=y5w;S1+=Z9w;S1+=H9w;var V1=V5w;V1+=T9w;var E1=r7w;E1+=g7w;var g1=E7w;g1+=V7w;var r1=S7w;r1+=t7w;r1+=K7w;var d1=P7w;d1+=y5w;d1+=Z9w;d1+=H9w;var k1=V5w;k1+=T9w;'use strict';E1aa.J0=function(U0){E1aa.W2x();if(E1aa)return E1aa.K0(U0);};E1aa.B0=function(i0){if(E1aa && i0)return E1aa.t0(i0);};E1aa.e0=function(b0){E1aa.W2x();if(E1aa)return E1aa.K0(b0);};(function(){var I7x=E1aa;var I7w="Editor - Trial";var s7w="5e2c";var u7w=" remain";var B7w="for Editor, ";var w7w="9e2";var y7w="4";var a7w="ed. To purchase a license ";var i7w=" expir";var b2l=55;var z7w=" has now expir";var e7w="getTime";var Z8w="- ";var X7w="5c33";var a2l=1000;var c7w="DataTables Editor trial info ";var M7w="bd1";var N7w="getTi";var o7w='Thank you for trying DataTables Editor\n\n';var n7w="9";var C7w="c7bc";var J2l=1615939200;var Y7w="45";var M2l=7564;var p7w="tatables.net/purchase";var R7w="a8";var b7w="c4b8";var J7w="7";var o2l=1988430053;var F7w="Your trial";var j7w="please see https://editor.da";var q1=N0w;q1+=A7w;q1+=f7w;var Z1=y7w;Z1+=w7w;var c0=y5w;c0+=R7w;c0+=H9w;var n0=N7w;n0+=x9w;I7x.u0=function(o0){if(I7x)return I7x.t0(o0);};I7x.I0=function(X0){I7x.W2x();if(I7x && X0)return I7x.K0(X0);};I7x.s0=function(T0){if(I7x && T0)return I7x.t0(T0);};var remaining=Math[I7x.C0(C7w)?E1aa[409963]:T7w]((new Date((I7x.s0(s7w)?J2l:o2l) * a2l)[I7x.e0(b7w)?e7w:E1aa[409963]]() - new Date()[n0]()) / ((I7x.I0(X7w)?a2l:M2l) * X2l * X2l * (I7x.B0(c0)?P2l:b2l)));if(remaining <= (I7x.p0(Z1)?h2l:O2l)){var h1=I7w;h1+=i7w;h1+=B0w;var D1=B7w;D1+=j7w;D1+=p7w;var v1=F7w;v1+=z7w;v1+=a7w;var l1=M7w;l1+=E1aa[540234];var H1=U7w;H1+=E1aa[434035];H1+=J7w;I7x.M0=function(a0){I7x.n2x();if(I7x && a0)return I7x.K0(a0);};I7x.z0=function(F0){if(I7x && F0)return I7x.K0(F0);};alert((I7x.z0(H1)?E1aa[409963]:o7w) + (I7x.M0(l1)?E1aa[409963]:v1) + D1);throw h1;}else if(remaining <= (I7x.J0(q1)?h2l:G2l)){var G1=u7w;G1+=Q7w;var x1=W7w;x1+=v9w;x1+=x0w;var O1=y5w;O1+=Y7w;O1+=n7w;var m1=c7w;m1+=Z8w;var L1=Z9w;L1+=D4w;L1+=K0w;console[L1](m1 + remaining + (I7x.u0(O1)?x1:E1aa[409963]) + (remaining === q2l?H8w:l8w) + G1);}})();var DataTable=$[k1][d1];if(!DataTable || !DataTable[r1] || !DataTable[g1](E1)){throw new Error(v8w);}var Editor=function(opts){var h8w="_constructor";var D8w="DataTables Editor must be initialised as a 'new' instance'";if(!(this instanceof Editor)){alert(D8w);}this[h8w](opts);};DataTable[q8w]=Editor;$[V1][S1][q8w]=Editor;var _editor_el=function(dis,ctx){var O8w="dte-e=";var L8w="*[";var t1=L8w;t1+=m8w;t1+=O8w;t1+=x8w;if(ctx === undefined){ctx=document;}return $(t1 + dis + G8w,ctx);};var __inlineCounter=h2l;var _pluck=function(a,prop){var K1=H9w;K1+=N0w;K1+=I0w;var out=[];$[K1](a,function(idx,el){var P1=n9w;E1aa.n2x();P1+=c9w;P1+=l9w;P1+=d5w;out[P1](el[prop]);});return out;};var _api_file=function(name,id){var r8w=' in table ';var d8w="d ";var k8w="Unknown file i";var A1=V5w;A1+=y9w;A1+=b5w;A1+=l9w;var table=this[A1](name);var file=table[id];if(!file){var f1=k8w;f1+=d8w;throw f1 + id + r8w + name;}E1aa.n2x();return table[id];};var _api_files=function(name){var V8w='Unknown file table name: ';if(!name){var y1=g8w;y1+=l9w;return Editor[y1];}var table=Editor[E8w][name];if(!table){throw V8w + name;}return table;};var _objectKeys=function(o){E1aa.W2x();var S8w="hasOwnProp";var t8w="erty";var out=[];for(var key in o){var w1=S8w;w1+=t8w;if(o[w1](key)){var R1=K8w;R1+=P8w;out[R1](key);}}return out;};var _deepCompare=function(o1,o2){var y8w="ob";var w8w="jec";var T1=A8w;T1+=K0w;T1+=i9w;T1+=d5w;var C1=A8w;C1+=f8w;var N1=y8w;N1+=w8w;N1+=i9w;if(typeof o1 !== E1aa[186121] || typeof o2 !== N1){return o1 == o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[C1] !== o2Props[T1]){return R8w;}for(var i=h2l,ien=o1Props[N8w];i < ien;i++){var s1=D4w;s1+=y5w;s1+=C8w;s1+=T8w;var propName=o1Props[i];if(typeof o1[propName] === s1){if(!_deepCompare(o1[propName],o2[propName])){return R8w;}}else if(o1[propName] != o2[propName]){return R8w;}}return s8w;};Editor[p9w]=function(opts,classes,host){var a3w="alToD";var z8w="ms";var I3w="Nam";var v6w="pe ";var b6w="multiRestore";var h3w="e-e=\"msg-message\" class=\"";var S3w="-value\" class=\"";var J6w='input-control';var n8w="g-";var C3w="lab";var H6w="or adding f";var P6w='<div data-dte-e="msg-label" class="';var b3w="<label data-";var V6w="typePrefix";var j8w="lti-v";var E3w="iValue";var g3w="dte-e=\"multi-info\" class=\"";var k3w="ultiI";var U3w="lFromData";var o6w='msg-message';var U6w="none";var V3w="<div data-dte-e=\"multi";var v3w="<div data";var z6w="ut-control";var c8w="<div data-dte-e=\"msg-info\" cl";var D3w="-dt";var q3w="<div data-dte-e=\"msg-error\" cla";var O3w="est";var u6w='msg-multi';var e3w="dte-e=\"label\" class=\"";var O6w="dataProp";var g6w="_fnSetObjectDataFn";var I6w='<div data-dte-e="field-processing" class="';var y6w='<div data-dte-e="input" class="';var L6w="ield_";var a8w="g-in";var e8w="d-";var t3w="inputContr";var q6w="DTE_F";var r3w="<span data-";var l6w="ield - unknown field ty";var s6w='<div data-dte-e="msg-multi" class="';var A6w='msg-label';var P3w="<div data-dte-e=\"in";var o3w="ataP";var G3w="inf";var B8w="lti-in";var F8w="msg-labe";var H3w="msg-";var A3w="put-control\" clas";var e6w='msg-error';var K3w="ol";var t6w='" for="';var i3w="namePrefi";var h5=H9w;h5+=N0w;h5+=f0w;h5+=d5w;var v5=f0w;v5+=Z9w;v5+=b8w;var l5=D4w;l5+=T9w;var H5=q7w;H5+=L0w;var u4=f0w;u4+=Z9w;u4+=b8w;var o4=t5w;o4+=e8w;o4+=X8w;o4+=I8w;var J4=i8w;J4+=B8w;J4+=H0w;var U4=i8w;U4+=j8w;U4+=p8w;var M4=F8w;M4+=Z9w;var a4=z8w;a4+=a8w;a4+=V5w;a4+=D4w;var z4=Z9w;z4+=M8w;z4+=Z9w;var F4=E1aa[540234];F4+=U8w;var p4=e0w;p4+=X0w;var j4=k7w;j4+=H9w;j4+=Z9w;j4+=E1aa[540234];var B4=E1aa[540234];B4+=D4w;B4+=L0w;var X4=X8w;X4+=H9w;X4+=J8w;var e4=o8w;e4+=u8w;e4+=Q8w;e4+=W8w;var b4=o8w;b4+=Y8w;b4+=W8w;var s4=x8w;s4+=W8w;var T4=z8w;T4+=n8w;T4+=t0w;T4+=H0w;var C4=c8w;C4+=Z3w;var N4=x8w;N4+=W8w;var R4=H3w;R4+=l3w;var w4=v3w;w4+=D3w;w4+=h3w;var y4=q3w;y4+=L3w;var f4=o8w;f4+=m3w;var A4=z9w;A4+=O3w;A4+=D4w;A4+=x3w;var P4=x8w;P4+=W8w;var K4=G3w;K4+=D4w;var t4=L0w;t4+=k3w;t4+=d3w;var S4=r3w;S4+=g3w;var V4=x8w;V4+=W8w;var E4=m5w;E4+=E3w;var g4=V3w;g4+=S3w;var r4=t3w;r4+=K3w;var d4=P3w;d4+=A3w;d4+=f3w;var k4=x8w;k4+=W8w;var G4=o8w;G4+=y3w;G4+=w3w;var x4=R3w;x4+=N3w;var O4=C3w;O4+=t1w;var m4=T3w;m4+=s3w;var L4=b3w;L4+=e3w;var q4=x8w;q4+=W8w;var h4=X3w;h4+=w0w;h4+=I3w;h4+=H9w;var D4=T9w;D4+=N0w;D4+=L0w;D4+=H9w;var v4=i3w;v4+=e1w;var l4=B3w;l4+=n9w;l4+=H9w;var H4=j3w;H4+=H1w;var Z4=p3w;Z4+=F3w;Z4+=f3w;var c1=z3w;c1+=a3w;c1+=M3w;var Q1=z3w;Q1+=N0w;Q1+=U3w;var u1=D4w;u1+=J3w;var J1=H9w;J1+=e1w;J1+=i9w;var U1=E1aa[540234];U1+=o3w;U1+=u3w;var z1=y9w;z1+=E1aa[540234];var F1=l9w;F1+=H9w;F1+=Q3w;var p1=m7w;p1+=y9w;p1+=t1w;p1+=E1aa[540234];var B1=i9w;B1+=x0w;B1+=n9w;B1+=H9w;var i1=c2l;i1+=W3w;var I1=h9w;I1+=q9w;I1+=L9w;var X1=m7w;X1+=y9w;X1+=H9w;X1+=P5w;var e1=i8w;e1+=Z9w;e1+=i9w;e1+=y9w;var b1=y9w;b1+=Y3w;b1+=n3w;b1+=T9w;var that=this;var multiI18n=host[b1][e1];opts=$[c3w](s8w,{},Editor[X1][I1],opts);if(!Editor[i1][opts[B1]]){var j1=Z6w;j1+=H6w;j1+=l6w;j1+=v6w;throw j1 + opts[N4w];}this[l9w]=$[c3w]({},Editor[p1][F1],{type:Editor[D6w][opts[N4w]],name:opts[h6w],classes:classes,host:host,opts:opts,multiValue:R8w});if(!opts[z1]){var M1=q6w;M1+=L6w;var a1=y9w;a1+=E1aa[540234];opts[a1]=M1 + opts[h6w];}if(opts[U1]){opts[m6w]=opts[O6w];}if(opts[m6w] === H8w){opts[m6w]=opts[h6w];}var dtPrivateApi=DataTable[J1][u1];this[Q1]=function(d){var k6w="nGetObjec";var r6w="aFn";var d6w="tDat";var n1=x6w;n1+=D4w;n1+=z9w;var Y1=G6w;Y1+=N0w;var W1=x4w;W1+=k6w;W1+=d6w;W1+=r6w;return dtPrivateApi[W1](opts[Y1])(d,n1);};this[c1]=dtPrivateApi[g6w](opts[m6w]);var template=$(Z4 + classes[H4] + E6w + classes[V6w] + opts[l4] + E6w + classes[v4] + opts[D4] + E6w + opts[h4] + q4 + L4 + classes[S6w] + t6w + Editor[m4](opts[r5w]) + K6w + opts[O4] + P6w + classes[A6w] + K6w + opts[f6w] + x4 + G4 + y6w + classes[w6w] + k4 + d4 + classes[r4] + R6w + g4 + classes[E4] + V4 + multiI18n[N6w] + S4 + classes[t4] + K6w + multiI18n[K4] + C6w + T6w + s6w + classes[b6w] + P4 + multiI18n[A4] + f4 + y4 + classes[e6w] + R6w + w4 + classes[R4] + N4 + opts[l3w] + T6w + C4 + classes[T4] + s4 + opts[X6w] + b4 + e4 + I6w + classes[X4] + i6w + T6w);var input=this[B6w](j6w,opts);if(input !== p6w){var I4=y9w;I4+=F6w;I4+=z6w;_editor_el(I4,template)[a6w](input);}else {var i4=E1aa[540234];i4+=K4w;i4+=x0w;template[M6w](i4,U6w);}this[B4]=$[c3w](s8w,{},Editor[j4][p4][F4],{container:template,inputControl:_editor_el(J6w,template),label:_editor_el(z4,template),fieldInfo:_editor_el(a4,template),labelInfo:_editor_el(M4,template),fieldError:_editor_el(e6w,template),fieldMessage:_editor_el(o6w,template),multi:_editor_el(U4,template),multiReturn:_editor_el(u6w,template),multiInfo:_editor_el(J4,template),processing:_editor_el(o4,template)});this[Q6w][W6w][T0w](u4,function(){var c6w="isabl";var H2w="sCl";var Y6w="eado";var c4=z9w;c4+=Y6w;c4+=n6w;var n4=i9w;n4+=x0w;n4+=n9w;n4+=H9w;var Y4=E1aa[540234];Y4+=c6w;Y4+=H9w;Y4+=E1aa[540234];var W4=Z2w;W4+=H2w;W4+=N0w;W4+=w0w;var Q4=D4w;Q4+=l2w;Q4+=l9w;if(that[l9w][Q4][v2w] && !template[W4](classes[Y4]) && opts[n4] !== c4){var Z5=z3w;Z5+=N0w;Z5+=Z9w;that[Z5](H8w);that[D2w]();}});this[H5][h2w][l5](v5,function(){var L2w="ore";var q2w="Rest";var D5=W6w;D5+=q2w;E1aa.W2x();D5+=L2w;that[D5]();});$[h5](this[l9w][N4w],function(name,fn){var q5=m2w;q5+=O2w;E1aa.n2x();if(typeof fn === q5 && that[name] === undefined){that[name]=function(){var x2w="appl";var O5=x2w;O5+=x0w;var m5=f0w;m5+=N0w;m5+=Z9w;m5+=Z9w;var L5=l9w;L5+=Z9w;L5+=y9w;L5+=G2w;var args=Array[k2w][L5][m5](arguments);args[d2w](name);var ret=that[B6w][O5](that,args);return ret === undefined?that:ret;};}});};Editor[x5][k2w]={def:function(set){var E2w="defau";var g5=E1aa[540234];g5+=H9w;E1aa.n2x();g5+=V5w;var opts=this[l9w][r2w];if(set === undefined){var r5=g2w;r5+=i9w;r5+=y9w;r5+=T0w;var d5=E1aa[540234];d5+=H9w;d5+=V5w;var k5=E2w;k5+=V2w;var G5=X1w;G5+=S2w;var def=opts[G5] !== undefined?opts[k5]:opts[d5];return typeof def === r5?def():def;}opts[g5]=set;return this;},disable:function(){var y2w='disable';var P2w="ontainer";var S5=e4w;S5+=g5w;S5+=H9w;S5+=t2w;var V5=X3w;V5+=K2w;var E5=f0w;E5+=P2w;this[Q6w][E5][A2w](this[l9w][V5][f2w]);this[S5](y2w);return this;},displayed:function(){var w2w="isp";var f5=T9w;f5+=D4w;f5+=w9w;var A5=E1aa[540234];A5+=w2w;A5+=y0w;A5+=x0w;var P5=y5w;P5+=D4w;P5+=R2w;var K5=N2w;K5+=C2w;K5+=H9w;K5+=z9w;var t5=E1aa[540234];t5+=D4w;t5+=L0w;var container=this[t5][K5];return container[T2w](P5)[N8w] && container[M6w](A5) != f5?s8w:R8w;},enable:function(){E1aa.W2x();var b2w="sable";var R5=q5w;R5+=s2w;var w5=w1w;w5+=b2w;w5+=E1aa[540234];var y5=e2w;y5+=X2w;this[Q6w][I2w][y5](this[l9w][i2w][w5]);this[B6w](R5);return this;},enabled:function(){var j2w="asClas";var T5=f0w;T5+=B2w;T5+=H9w;T5+=l9w;var C5=d5w;C5+=j2w;C5+=l9w;var N5=N2w;N5+=N0w;N5+=y9w;N5+=p2w;return this[Q6w][N5][C5](this[l9w][T5][f2w]) === R8w;},error:function(msg,fn){var F2w="msg";E1aa.n2x();var z2w="conta";var U2w='errorMessage';var J2w="fieldError";var M2w="veCl";var X5=e4w;X5+=F2w;var classes=this[l9w][i2w];if(msg){var b5=z2w;b5+=y9w;b5+=p2w;var s5=E1aa[540234];s5+=D4w;s5+=L0w;this[s5][b5][A2w](classes[a2w]);}else {var e5=e2w;e5+=M2w;e5+=F3w;e5+=l9w;this[Q6w][I2w][e5](classes[a2w]);}this[B6w](U2w,msg);return this[X5](this[Q6w][J2w],msg,fn);},fieldInfo:function(msg){return this[o2w](this[Q6w][X6w],msg);},isMultiValue:function(){E1aa.n2x();return this[l9w][u2w] && this[l9w][Q2w][N8w] !== q2l;},inError:function(){var Y2w="lasses";var B5=W2w;B5+=z1w;var i5=f0w;i5+=Y2w;var I5=E1aa[540234];I5+=D4w;I5+=L0w;return this[I5][I2w][n2w](this[l9w][i5][B5]);},input:function(){var Z9n="eFn";var a5=q7w;a5+=L0w;var z5=y9w;z5+=T9w;z5+=K8w;z5+=i9w;var F5=c2w;F5+=Z9n;var p5=t0w;p5+=H9n;var j5=g5w;j5+=H9w;E1aa.n2x();return this[l9w][j5][p5]?this[F5](z5):$(l9n,this[a5][I2w]);},focus:function(){E1aa.n2x();var h9n="iner";var D9n="onta";var M5=V5w;M5+=v9n;M5+=W5w;if(this[l9w][N4w][M5]){var U5=H0w;U5+=G4w;this[B6w](U5);}else {var J5=f0w;J5+=D9n;J5+=h9n;$(l9n,this[Q6w][J5])[D2w]();}return this;},get:function(){var m9n='get';var u5=E1aa[540234];u5+=q9n;var o5=c2w;o5+=H9w;o5+=m7w;o5+=T9w;if(this[L9n]()){return undefined;}var val=this[o5](m9n);return val !== undefined?val:this[u5]();},hide:function(animate){var r9n="ideUp";var O9n="ho";var Q5=O9n;Q5+=x9n;var el=this[Q6w][I2w];if(animate === undefined){animate=s8w;}if(this[l9w][Q5][G9n]() && animate && $[k9n][d9n]){var W5=l9w;W5+=Z9w;W5+=r9n;el[W5]();}else {var Y5=w1w;Y5+=l9w;Y5+=g9n;Y5+=E9n;el[M6w](Y5,V9n);}return this;},label:function(str){var H7=S9n;H7+=t9n;H7+=E1aa[540234];var c5=E1aa[540234];c5+=K9n;c5+=N0w;c5+=I0w;var n5=E1aa[540234];n5+=D4w;n5+=L0w;var label=this[Q6w][S6w];var labelInfo=this[n5][f6w][c5]();if(str === undefined){var Z7=d5w;Z7+=i9w;Z7+=L0w;Z7+=Z9w;return label[Z7]();}label[P9n](str);label[H7](labelInfo);return this;},labelInfo:function(msg){var A9n="abelInfo";var l7=Z9w;l7+=A9n;return this[o2w](this[Q6w][l7],msg);},message:function(msg,fn){var y9n="sg";E1aa.n2x();var w9n="fieldMessage";var f9n="_m";var v7=f9n;v7+=y9n;return this[v7](this[Q6w][w9n],msg,fn);},multiGet:function(id){var C9n="tiValues";var R9n="multiId";E1aa.n2x();var h7=R9n;h7+=l9w;var D7=N9n;D7+=C9n;var value;var multiValues=this[l9w][D7];var multiIds=this[l9w][h7];var isMultiValue=this[L9n]();if(id === undefined){var q7=T9n;q7+=i9w;q7+=d5w;var fieldVal=this[s9n]();value={};for(var i=h2l;i < multiIds[q7];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {var L7=z3w;L7+=N0w;L7+=Z9w;value=this[L7]();}return value;},multiRestore:function(){var m7=N9n;m7+=b9n;E1aa.W2x();m7+=p8w;this[l9w][m7]=s8w;this[e9n]();},multiSet:function(id,val){var X9n="multiVa";var j9n="multiValues";var i9n="isPl";var B9n="inObj";var k7=X9n;k7+=Z9w;E1aa.W2x();k7+=I9n;var x7=i9n;x7+=N0w;x7+=B9n;x7+=T8w;var multiValues=this[l9w][j9n];var multiIds=this[l9w][Q2w];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,val){var p9n="Arr";E1aa.W2x();var O7=t0w;O7+=p9n;O7+=E9n;if($[O7](multiIds) === -q2l){multiIds[F9n](idSrc);}multiValues[idSrc]=val;};if($[x7](val) && id === undefined){$[z9n](val,function(idSrc,innerVal){E1aa.n2x();set(idSrc,innerVal);});}else if(id === undefined){var G7=a9n;G7+=d5w;$[G7](multiIds,function(i,idSrc){set(idSrc,val);});}else {set(id,val);}this[l9w][k7]=s8w;this[e9n]();return this;},name:function(){var r7=M9n;r7+=L0w;E1aa.W2x();r7+=H9w;var d7=D4w;d7+=n9w;d7+=i9w;d7+=l9w;return this[l9w][d7][r7];},node:function(){var g7=N2w;g7+=C2w;g7+=H1w;E1aa.n2x();return this[Q6w][g7][h2l];},processing:function(set){var J9n="spla";var A7=V4w;A7+=k0w;var P7=U9n;P7+=T9w;P7+=H9w;var K7=w1w;K7+=J9n;K7+=x0w;var t7=f0w;t7+=l9w;t7+=l9w;var S7=q7w;S7+=L0w;if(set === undefined){var V7=f0w;V7+=w0w;var E7=E1aa[540234];E7+=D4w;E7+=L0w;return this[E7][o9n][V7](u9n) === Q9n;}E1aa.n2x();this[S7][o9n][t7](K7,set?Q9n:P7);this[l9w][W9n][A7](Y9n,[set]);return this;},set:function(val,multiCheck){var n9n="_ty";var c9n="tityDecode";var s7=l9w;s7+=H9w;s7+=i9w;var T7=n9n;T7+=r9w;T7+=m7w;T7+=T9w;var C7=q5w;C7+=c9n;var N7=D4w;N7+=n9w;E1aa.n2x();N7+=Z0n;var decodeFn=function(d){var x0n='"';var D0n="epla";var k0n='\'';var v0n="lace";var d0n='\n';var G0n='£';var H0n="repl";var m0n='<';var R7=H0n;R7+=l0n;R7+=H9w;var w7=x3w;w7+=n9w;w7+=v0n;var y7=z9w;y7+=D0n;y7+=G2w;var f7=h0n;f7+=K0w;return typeof d !== f7?d:d[y7](/&gt;/g,q0n)[L0n](/&lt;/g,m0n)[w7](/&amp;/g,O0n)[L0n](/&quot;/g,x0n)[L0n](/&#163;/g,G0n)[R7](/&#39;/g,k0n)[L0n](/&#10;/g,d0n);};this[l9w][u2w]=R8w;var decode=this[l9w][N7][C7];if(decode === undefined || decode === s8w){if(Array[r0n](val)){for(var i=h2l,ien=val[N8w];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}this[T7](s7,val);if(multiCheck === undefined || multiCheck === s8w){this[e9n]();}return this;},show:function(animate){var g0n="sli";var E0n="Down";var I7=g0n;I7+=h9w;I7+=E0n;var X7=V5w;X7+=T9w;var e7=V0n;e7+=N0w;e7+=x0w;var b7=S0n;b7+=t0n;b7+=y9w;b7+=p2w;var el=this[Q6w][b7];if(animate === undefined){animate=s8w;}if(this[l9w][W9n][e7]() && animate && $[X7][I7]){el[K0n]();}else {el[M6w](u9n,H8w);;}return this;},val:function(val){E1aa.n2x();return val === undefined?this[P0n]():this[H7w](val);},compare:function(value,original){var A0n="compar";var i7=A0n;i7+=H9w;var compare=this[l9w][r2w][i7] || _deepCompare;E1aa.W2x();return compare(value,original);},dataSrc:function(){var B7=E1aa[540234];B7+=N0w;E1aa.W2x();B7+=t0n;return this[l9w][r2w][B7];},destroy:function(){var y0n='destroy';this[Q6w][I2w][f0n]();E1aa.W2x();this[B6w](y0n);return this;},multiEditable:function(){var w0n="Editab";var p7=W6w;p7+=w0n;p7+=b5w;var j7=D4w;j7+=n9w;j7+=i9w;j7+=l9w;return this[l9w][j7][p7];},multiIds:function(){var R0n="multiI";var F7=R0n;F7+=K5w;E1aa.n2x();return this[l9w][F7];},multiInfoShown:function(show){var C0n="bloc";var a7=N0n;a7+=H9w;var z7=C0n;z7+=V7w;this[Q6w][T0n][M6w]({display:show?z7:a7});},multiReset:function(){var s0n="alues";var b0n="iIds";var U7=N9n;U7+=b9n;U7+=s0n;var M7=N9n;M7+=i9w;M7+=b0n;this[l9w][M7]=[];this[l9w][U7]={};},submittable:function(){var J7=D4w;J7+=n9w;J7+=i9w;J7+=l9w;return this[l9w][J7][e0n];},valFromData:p6w,valToData:p6w,_errorNode:function(){E1aa.n2x();var X0n="dE";var o7=t5w;o7+=X0n;o7+=I0n;return this[Q6w][o7];},_msg:function(el,msg,fn){var j0n=":visible";E1aa.n2x();var Q7=y9w;Q7+=l9w;if(msg === undefined){return el[P9n]();}if(typeof msg === E1aa[363362]){var u7=v1w;u7+=n9w;u7+=y9w;var editor=this[l9w][W9n];msg=msg(editor,new DataTable[u7](editor[l9w][i0n]));}if(el[B0n]()[Q7](j0n) && $[k9n][p0n]){el[P9n](msg);if(msg){el[K0n](fn);;}else {el[d9n](fn);}}else {var W7=T9w;W7+=D4w;W7+=T9w;W7+=H9w;el[P9n](msg || H8w)[M6w](u9n,msg?Q9n:W7);if(fn){fn();}}return this;},_multiValueCheck:function(){var Q0n="inputControl";var c0n="multiNoEdit";var o0n="ock";var M0n="ul";var J0n="ues";var Y0n="noMulti";var z0n="iV";var U0n="tiVal";var a0n="alu";var G8=d5w;G8+=D4w;G8+=x9n;var x8=X3w;x8+=K2w;var O8=E1aa[540234];O8+=D4w;O8+=L0w;var m8=y9w;m8+=d3w;var L8=E1aa[540234];L8+=D4w;L8+=L0w;var q8=d5w;q8+=D4w;q8+=l9w;q8+=i9w;var h8=b5w;h8+=T9w;h8+=F0n;h8+=d5w;var D8=E1aa[540234];D8+=D4w;D8+=L0w;var n7=m5w;n7+=z0n;n7+=a0n;n7+=H9w;var Y7=L0w;Y7+=M0n;Y7+=U0n;Y7+=J0n;var last;var ids=this[l9w][Q2w];var values=this[l9w][Y7];var isMultiValue=this[l9w][n7];var isMultiEditable=this[l9w][r2w][v2w];var val;var different=R8w;if(ids){for(var i=h2l;i < ids[N8w];i++){val=values[ids[i]];if(i > h2l && !_deepCompare(val,last)){different=s8w;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[L9n]()){var H8=y5w;H8+=Z9w;H8+=o0n;var Z8=U9n;Z8+=T9w;Z8+=H9w;var c7=u0n;c7+=l9w;this[Q6w][Q0n][c7]({display:Z8});this[Q6w][W6w][M6w]({display:H8});}else {var v8=i8w;v8+=V2w;v8+=y9w;var l8=E1aa[540234];l8+=D4w;l8+=L0w;this[Q6w][Q0n][M6w]({display:Q9n});this[l8][v8][M6w]({display:V9n});if(isMultiValue && !different){this[H7w](last,R8w);}}this[D8][h2w][M6w]({display:ids && ids[h8] > q2l && different && !isMultiValue?Q9n:V9n});var i18n=this[l9w][q8][W0n][W6w];this[L8][T0n][P9n](isMultiEditable?i18n[m8]:i18n[Y0n]);this[O8][W6w][n0n](this[l9w][x8][c0n],!isMultiEditable);this[l9w][G8][Z1n]();return s8w;},_typeFn:function(name){var l1n="hif";var r8=D4w;r8+=n9w;r8+=i9w;r8+=l9w;var d8=H1n;d8+=l1n;d8+=i9w;var k8=f0w;k8+=v1n;var args=Array[k2w][D1n][k8](arguments);E1aa.n2x();args[h1n]();args[d8](this[l9w][r8]);var fn=this[l9w][N4w][name];if(fn){return fn[q1n](this[l9w][W9n],args);}}};Editor[p9w][L1n]={};Editor[g8][E8]={"className":E1aa[409963],"data":E1aa[409963],"def":E1aa[409963],"fieldInfo":E1aa[409963],"id":E1aa[409963],"label":E1aa[409963],"labelInfo":E1aa[409963],"name":p6w,"type":m1n,"message":E1aa[409963],"multiEditable":s8w,"submit":s8w};Editor[V8][L1n][O1n]={type:p6w,name:p6w,classes:p6w,opts:p6w,host:p6w};Editor[S8][L1n][t8]={container:p6w,label:p6w,labelInfo:p6w,fieldInfo:p6w,fieldError:p6w,fieldMessage:p6w};Editor[L1n]={};Editor[K8][x1n]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[L1n][P8]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[A8][f8]={"ajaxUrl":p6w,"ajax":p6w,"dataSource":p6w,"domTable":p6w,"opts":p6w,"displayController":p6w,"fields":{},"order":[],"id":-q2l,"displayed":R8w,"processing":R8w,"modifier":p6w,"action":p6w,"idSrc":p6w,"unique":h2l};Editor[L1n][G1n]={"label":p6w,"fn":p6w,"className":p6w};Editor[L1n][y8]={onReturn:w8,onBlur:k1n,onBackground:d1n,onComplete:R8,onEsc:k1n,onFieldError:N8,submit:r1n,focus:h2l,buttons:s8w,title:s8w,message:s8w,drawType:R8w,scope:g1n};Editor[G9n]={};(function(){var p5n='<div class="DTED_Lightbox_Background"><div></div></div>';var E1n="<div class=\"";var B5n='<div class="DTED_Lightbox_Container">';var o4n="ig";var s1n="ni";var K1n="<div class=\"DTE";var j5n='<div class="DTED_Lightbox_Content_Wrapper">';var P1n="D_Lightbox_Content\">";var W4n="scrollTop";var S1n="></div";var W1n="backgr";var i5n='<div class="DTED DTED_Lightbox_Wrapper">';var V1n="DTED_Lightbox_Close\"";var F5n="lightbox";var g6=f0w;g6+=D4w;g6+=T9w;g6+=V5w;var r6=E1n;r6+=V1n;E1aa.n2x();r6+=S1n;r6+=W8w;var d6=t1n;d6+=Q8w;d6+=W8w;var k6=o8w;k6+=m3w;var G6=K1n;G6+=P1n;var e8=A1n;e8+=q5w;e8+=E1aa[540234];var b8=Z9w;b8+=y9w;b8+=f1n;var s8=E1aa[540234];s8+=y1n;s8+=g9n;s8+=E9n;function isMobile(){var R1n="rWidth";var T1n='undefined';var N1n="orienta";var F2l=576;var T8=w1n;T8+=H9w;T8+=R1n;var C8=N1n;C8+=i9w;C8+=C1n;return typeof window[C8] !== T1n && window[T8] <= F2l?s8w:R8w;}var self;Editor[s8][b8]=$[e8](s8w,{},Editor[L1n][x1n],{"init":function(dte){var X8=e4w;X8+=y9w;X8+=s1n;E1aa.n2x();X8+=i9w;self[X8]();return self;},"open":function(dte,append,callback){var e1n="ppen";var a1n="_show";var X1n="detac";var z1n="_shown";var p8=f0w;p8+=b1n;var j8=t4w;j8+=U8w;var B8=N0w;B8+=e1n;B8+=E1aa[540234];var i8=X1n;i8+=d5w;var I8=e4w;I8+=P8w;I8+=I1n;I8+=T9w;if(self[I8]){if(callback){callback();}return;}self[i1n]=dte;var content=self[B1n][j1n];content[p1n]()[i8]();content[F1n](append)[B8](self[j8][p8]);self[z1n]=s8w;self[a1n](callback);},"close":function(dte,callback){var U1n="dte";var M1n="hown";var M8=e4w;M8+=l9w;E1aa.W2x();M8+=M1n;var a8=e4w;a8+=d5w;a8+=r5w;a8+=H9w;var z8=e4w;z8+=U1n;var F8=e4w;F8+=l9w;F8+=d5w;F8+=J1n;if(!self[F8]){if(callback){callback();}return;}self[z8]=dte;self[a8](callback);self[M8]=R8w;},node:function(dte){var U8=o1n;U8+=u1n;U8+=H1w;return self[B1n][U8][h2l];},"_init":function(){var D4n='div.DTED_Lightbox_Content';var Y1n="oun";var v4n="ady";var l4n="_re";var c8=Q1n;c8+=x0w;var n8=f0w;n8+=l9w;n8+=l9w;var Y8=W1n;Y8+=Y1n;Y8+=E1aa[540234];var W8=n1n;W8+=c1n;var Q8=Z4n;Q8+=H4n;Q8+=z9w;var u8=e4w;u8+=E1aa[540234];u8+=D4w;u8+=L0w;var o8=S0n;o8+=D0w;var J8=l4n;J8+=v4n;if(self[J8]){return;}var dom=self[B1n];dom[o8]=$(D4n,self[u8][h4n]);dom[Q8][M6w](W8,h2l);dom[Y8][n8](c8,h2l);},"_show":function(callback){var f4n='DTED_Lightbox_Mobile';var w4n='auto';var R4n="offsetAni";var r4n="18n";var m4n="lTo";var K4n="nimat";var O4n="size.DTED_Lightbox";var k4n="div.DTED_Lightbox_Content_Wr";var y4n='height';var p3=q4n;p3+=E1aa[540234];p3+=x0w;var j3=e4w;j3+=L4n;j3+=m4n;j3+=n9w;var i3=x3w;i3+=O4n;var I3=D4w;I3+=T9w;var T3=f0w;T3+=x4n;T3+=f1n;var C3=D4w;C3+=T9w;var N3=G4n;N3+=z9w;var R3=k4n;R3+=d4n;var f3=W1n;f3+=D4w;f3+=c9w;f3+=o5w;var P3=D4w;P3+=T9w;var K3=y9w;K3+=r4n;var t3=g4n;t3+=E4n;var S3=N0w;S3+=V4n;var V3=f0w;V3+=Z9w;V3+=S4n;var r3=t4w;r3+=S9w;var d3=o1n;d3+=d4n;var k3=t4n;k3+=K4n;k3+=H9w;var G3=e4w;G3+=E1aa[540234];G3+=S9w;var x3=j3w;x3+=H1w;var O3=t4w;O3+=D4w;O3+=L0w;var m3=P4n;m3+=T9w;m3+=E1aa[540234];var L3=S9n;L3+=r9w;L3+=o5w;var q3=q4n;q3+=R2w;var h3=f0w;h3+=D4w;h3+=T9w;h3+=V5w;var D3=f0w;D3+=l9w;D3+=l9w;var v3=o1n;v3+=u1n;v3+=H1w;var l3=f0w;l3+=l9w;l3+=l9w;var H3=S0n;H3+=D0w;var Z3=e4w;Z3+=E1aa[540234];Z3+=U8w;var that=this;var dom=self[Z3];if(isMobile()){$(A4n)[A2w](f4n);}dom[H3][l3](y4n,w4n);dom[v3][D3]({top:-self[h3][R4n]});$(q3)[L3](self[B1n][N4n])[m3](self[O3][x3]);self[C4n]();self[G3][k3](dom[d3],{opacity:q2l,top:h2l},callback);self[r3][T4n](dom[N4n],{opacity:q2l});setTimeout(function(){var e4n='text-indent';var s4n="div.DTE_Fo";var b4n="oter";var E3=u0n;E3+=l9w;var g3=s4n;g3+=b4n;$(g3)[E3](e4n,-q2l);},d2l);dom[V3][S3](t3,self[i1n][K3][X4n])[P3](I4n,function(e){var A3=i4n;A3+=T4w;E1aa.n2x();A3+=H9w;self[i1n][A3]();});dom[f3][T0w](I4n,function(e){var j4n="agation";var B4n="stopImmediateP";var w3=t4w;w3+=S9w;var y3=B4n;E1aa.W2x();y3+=u3w;y3+=j4n;e[y3]();self[w3][N4n]();});$(R3,dom[N3])[C3](T3,function(e){var z4n="ackgro";var M4n="stopImmediatePropa";var F4n='DTED_Lightbox_Content_Wrapper';var U4n="gation";var s3=p4n;s3+=H9w;s3+=i9w;if($(e[s3])[n2w](F4n)){var X3=y5w;X3+=z4n;X3+=a4n;var e3=e4w;e3+=E1aa[540234];e3+=i9w;e3+=H9w;var b3=M4n;b3+=U4n;e[b3]();self[e3][X3]();}});$(window)[I3](i3,function(){var J4n="_he";var Q4n="lc";var u4n="htCa";var B3=J4n;B3+=o4n;E1aa.W2x();B3+=u4n;B3+=Q4n;self[B3]();});self[j3]=$(p3)[W4n]();},"_heightCalc":function(){var n4n="eight";var d5n="owPad";var c4n="oute";var q5n="Body_Content";var r5n="ding";var Y4n="outerH";var O5n='px)';var v5n="TE_Head";var h5n="div.DTE_";var k5n="wind";var m5n='calc(100vh - ';var g5n="heig";var x5n="axH";var a3=Y4n;a3+=n4n;var z3=c4n;z3+=Z5n;z3+=o4n;z3+=H5n;var F3=l5n;F3+=m9w;F3+=v5n;F3+=H1w;var dom=self[B1n];var headerFooter=$(F3,dom[h4n])[z3]() + $(D5n,dom[h4n])[a3]();if(isMobile()){var M3=h5n;M3+=q5n;$(M3,dom[h4n])[M6w](L5n,m5n + headerFooter + O5n);}else {var W3=L0w;W3+=x5n;W3+=n4n;var Q3=f0w;Q3+=l9w;Q3+=l9w;var u3=G5n;u3+=n9w;u3+=H1w;var o3=k5n;o3+=d5n;o3+=r5n;var J3=S0n;J3+=V5w;var U3=g5n;U3+=H5n;var maxHeight=$(window)[U3]() - self[J3][o3] * L2l - headerFooter;$(E5n,dom[u3])[Q3](W3,maxHeight);}},"_hide":function(callback){var C5n="offse";var S5n="D_Lightbox";var K5n="div.DTED_Lightb";var b5n="_scrollTop";var R5n="ckground";var f5n=".DTED_Lightbox";var P5n="ox_Content_Wrapper";var x6=V5n;x6+=d0w;x6+=S5n;var O6=t5n;O6+=V5w;var m6=K5n;m6+=P5n;var L6=A5n;L6+=f5n;var q6=D4w;q6+=A7w;var h6=f0w;h6+=y5n;h6+=y4w;var v6=w5n;v6+=R5n;var l6=e4w;l6+=N5n;l6+=H9w;var H6=C5n;H6+=i9w;H6+=v1w;H6+=s1n;var Z6=f0w;Z6+=T0w;Z6+=V5w;var c3=T5n;c3+=s5n;var n3=e4w;n3+=E1aa[540234];n3+=S9w;var Y3=y5w;Y3+=D4w;Y3+=E1aa[540234];Y3+=x0w;var dom=self[B1n];if(!callback){callback=function(){};}$(Y3)[W4n](self[b5n]);self[n3][c3](dom[h4n],{opacity:h2l,top:self[Z6][H6]},function(){$(this)[e5n]();E1aa.n2x();callback();});self[l6][T4n](dom[v6],{opacity:h2l},function(){var X5n="deta";var D6=X5n;D6+=f0w;D6+=d5w;$(this)[D6]();});dom[h6][q6](L6);dom[N4n][I5n](I4n);$(m6,dom[h4n])[I5n](I4n);$(window)[O6](x6);},"_dte":p6w,"_ready":R8w,"_shown":R8w,"_dom":{"wrapper":$(i5n + B5n + j5n + G6 + k6 + d6 + T6w + T6w),"background":$(p5n),"close":$(r6),"content":p6w}});self=Editor[G9n][F5n];self[g6]={"offsetAni":A2l,"windowPadding":A2l};})();(function(){var d7n="ckgro";var u7n="round";var k3n='<div class="DTED_Envelope_Shadow"></div>';var s2l=50;var h7n="ontent";var R7n="style";var J5n="v ";var n5n="envelop";var u5n="\"DTED_Envelope_Close\">&times;</div>";var M5n="lope";var W5n="s=\"DTED_E";var G3n='<div class="DTED DTED_Envelope_Wrapper">';var m7n="appendChild";var r7n="_do";var v8n="conte";var Q5n="<div clas";var Y5n="nvelope_Container\"></div>";var x7n="_dt";var d3n='<div class="DTED_Envelope_Background"><div></div></div>';var Y9J=f0w;Y9J+=z5n;var W9J=q5w;W9J+=a5n;W9J+=M5n;var Q9J=V0n;Q9J+=E9n;var u9J=U5n;u9J+=J5n;u9J+=o5n;u9J+=u5n;var o9J=Q5n;o9J+=W5n;o9J+=Y5n;var t6=h7w;t6+=E1aa[540234];t6+=t1w;t6+=l9w;var S6=A1n;S6+=i5w;var V6=n5n;V6+=H9w;var E6=c5n;E6+=Z9w;E6+=E9n;var self;Editor[E6][V6]=$[S6](s8w,{},Editor[t6][x1n],{"init":function(dte){E1aa.n2x();var Z7n="_init";self[i1n]=dte;self[Z7n]();return self;},"open":function(dte,append,callback){var L7n="dre";var v7n="dC";var b6=H7n;b6+=I1n;var s6=l7n;s6+=y4w;var T6=e4w;T6+=E1aa[540234];T6+=U8w;var C6=u1n;C6+=q5w;C6+=v7n;C6+=D7n;var N6=f0w;N6+=h7n;var R6=t4w;R6+=U8w;var w6=e4w;w6+=E1aa[540234];w6+=U8w;var y6=E1aa[540234];y6+=K9n;y6+=N0w;y6+=I0w;var f6=I0w;f6+=q7n;f6+=L7n;f6+=T9w;var A6=S0n;A6+=D0w;var P6=e4w;P6+=q7w;P6+=L0w;var K6=e4w;K6+=E1aa[540234];K6+=S9w;self[K6]=dte;$(self[P6][A6])[f6]()[y6]();self[w6][j1n][m7n](append);self[R6][N6][C6](self[T6][s6]);self[b6](callback);},"close":function(dte,callback){var O7n="hi";var X6=e4w;X6+=O7n;X6+=E1aa[540234];X6+=H9w;var e6=x7n;e6+=H9w;self[e6]=dte;self[X6](callback);},node:function(dte){E1aa.W2x();var I6=G5n;I6+=G7n;return self[B1n][I6][h2l];},"_init":function(){var t7n="ground";var P7n="den";var K7n="hid";var y7n="_ready";var g7n="_cssBackgr";var V7n="Opacity";var k7n="visibl";var C7n='opacity';var N7n="visbility";var w7n='div.DTED_Envelope_Container';var S7n="sty";var Q6=k7n;Q6+=H9w;var u6=x9n;u6+=x0w;u6+=Z9w;u6+=H9w;var o6=f0w;o6+=l9w;o6+=l9w;var J6=w5n;J6+=d7n;J6+=a4n;var U6=r7n;E1aa.W2x();U6+=L0w;var M6=g7n;M6+=E7n;M6+=V7n;var a6=E1aa[540234];a6+=y1n;a6+=g9n;a6+=E9n;var z6=S7n;z6+=Z9w;z6+=H9w;var F6=M5w;F6+=t7n;var p6=t4w;p6+=U8w;var j6=K7n;j6+=P7n;var B6=C1w;B6+=A7n;B6+=H4n;B6+=z9w;var i6=f7n;i6+=i9w;if(self[y7n]){return;}self[B1n][i6]=$(w7n,self[B1n][B6])[h2l];self[B1n][N4n][R7n][N7n]=j6;self[p6][F6][z6][a6]=Q9n;self[M6]=$(self[U6][J6])[o6](C7n);self[B1n][N4n][u6][G9n]=V9n;self[B1n][N4n][R7n][N7n]=Q6;},"_show":function(callback){var j7n="_Envelope";var s7n="TED_";var T7n="resize.D";var U7n="ackgroundOpacity";var I7n="click.DTED_Env";var J7n="backg";var H8n="aut";var k8n="offsetHeight";var g8n="windowScroll";var e7n="lic";var X7n="k.DTED_Envelo";var a7n="rmal";var b7n="Envelope";var K8n="windowPadding";var M7n="cssB";var B7n="click.DTED";var O8n="marginLeft";var D8n="ndC";var l8n="eig";var S8n="tml,body";var n7n="fse";var o7n="acity";var h8n="ild";var i7n="elope";var c7n="tWidth";var W7n="wid";var r8n="fadeIn";var m8n="_findAttachRow";var d8n="px";var P8n='div.DTED_Lightbox_Content_Wrapper';var L8n="body";var q9J=T7n;q9J+=s7n;q9J+=b7n;var h9J=D4w;h9J+=T9w;var l9J=f0w;l9J+=e7n;l9J+=X7n;l9J+=r9w;var H9J=D4w;H9J+=T9w;var c2=I7n;c2+=i7n;var n2=e4w;n2+=E1aa[540234];n2+=D4w;n2+=L0w;var W2=B7n;W2+=j7n;var Q2=p7n;Q2+=n3w;Q2+=T9w;var J2=i9w;J2+=F7n;J2+=b5w;var U2=y1w;U2+=i9w;U2+=z9w;var M2=z7n;M2+=H9w;var a2=e4w;a2+=q7w;a2+=L0w;var i2=S0n;i2+=V5w;var I2=T9w;I2+=D4w;I2+=a7n;var X2=e4w;X2+=M7n;X2+=U7n;var e2=N5w;e2+=g9n;e2+=E9n;var b2=J7n;b2+=H4w;b2+=c9w;b2+=o5w;var s2=D4w;s2+=n9w;s2+=o7n;var T2=l9w;T2+=B3w;T2+=Z9w;T2+=H9w;var C2=J7n;C2+=u7n;var w2=e4w;w2+=E1aa[540234];w2+=U8w;var y2=l9w;y2+=i9w;y2+=Q7n;y2+=H9w;var A2=f0w;A2+=D4w;A2+=k0w;A2+=B5w;var P2=e4w;P2+=Q6w;var K2=n9w;K2+=e1w;var t2=x9n;t2+=x0w;t2+=Z9w;t2+=H9w;var S2=n9w;S2+=e1w;var V2=j3w;V2+=H1w;var E2=n9w;E2+=e1w;var g2=W7n;g2+=Y7n;var d2=o1n;d2+=d4n;var k2=t4w;k2+=U8w;var G2=n1n;G2+=c1n;var x2=N0n;x2+=H9w;var O2=N5w;O2+=n9w;O2+=Z9w;O2+=E9n;var m2=t5n;m2+=n7n;m2+=c7n;var L2=E1aa[540234];L2+=w5w;L2+=E9n;var q2=Q1n;q2+=x0w;var h2=Z8n;h2+=H9w;var D2=o1n;D2+=d4n;var v2=e4w;v2+=E1aa[540234];v2+=D4w;v2+=L0w;var l2=H8n;l2+=D4w;var H2=d5w;H2+=l8n;H2+=H5n;var Z2=v8n;Z2+=k0w;var c6=G4n;c6+=z9w;var n6=e4w;n6+=Q6w;var Y6=P4n;Y6+=D8n;Y6+=d5w;Y6+=h8n;var W6=q8n;W6+=x0w;var that=this;var formHeight;if(!callback){callback=function(){};}document[W6][Y6](self[n6][N4n]);document[L8n][m7n](self[B1n][c6]);self[B1n][Z2][R7n][H2]=l2;var style=self[v2][D2][h2];style[q2]=h2l;style[L2]=Q9n;var targetRow=self[m8n]();var height=self[C4n]();var width=targetRow[m2];style[O2]=x2;style[G2]=q2l;self[k2][d2][R7n][g2]=width + E2;self[B1n][V2][R7n][O8n]=-(width / L2l) + S2;self[B1n][h4n][t2][x8n]=$(targetRow)[G8n]()[x8n] + targetRow[k8n] + K2;self[P2][A2][y2][x8n]=-q2l * height - t2l + d8n;self[w2][C2][T2][s2]=h2l;self[B1n][b2][R7n][e2]=Q9n;$(self[B1n][N4n])[p0n]({'opacity':self[X2]},I2);$(self[B1n][h4n])[r8n]();if(self[i2][g8n]){var j2=E8n;j2+=V8n;var B2=d5w;B2+=S8n;$(B2)[j2]({"scrollTop":$(targetRow)[G8n]()[x8n] + targetRow[k8n] - self[t8n][K8n]},function(){var p2=f0w;p2+=h7n;$(self[B1n][p2])[p0n]({"top":h2l},z2l,callback);});}else {var F2=e4w;F2+=E1aa[540234];F2+=D4w;F2+=L0w;$(self[F2][j1n])[p0n]({"top":h2l},z2l,callback);}$(self[a2][M2])[U2](J2,self[i1n][Q2][X4n])[T0w](W2,function(e){var Y2=t4w;Y2+=i9w;Y2+=H9w;self[Y2][X4n]();});$(self[n2][N4n])[T0w](c2,function(e){var Z9J=w5n;E1aa.W2x();Z9J+=d7n;Z9J+=c9w;Z9J+=o5w;self[i1n][Z9J]();});$(P8n,self[B1n][h4n])[H9J](l9J,function(e){var A8n="arg";var f8n='DTED_Envelope_Content_Wrapper';var v9J=i9w;v9J+=A8n;v9J+=K9n;if($(e[v9J])[n2w](f8n)){var D9J=e4w;D9J+=E1aa[540234];D9J+=i9w;D9J+=H9w;self[D9J][N4n]();}});$(window)[h9J](q9J,function(){self[C4n]();});},"_heightCalc":function(){var C8n="windo";var b8n="nf";var T8n="wPadding";var w8n="igh";var I8n='div.DTE_Header';var y8n="outerHe";var e8n="heightCalc";var R8n="outerHei";var i8n="outerHeight";var S9J=y8n;S9J+=w8n;S9J+=i9w;var V9J=u0n;V9J+=l9w;var E9J=e4w;E9J+=q7w;E9J+=L0w;var g9J=R8n;g9J+=N8n;g9J+=i9w;var r9J=C1w;r9J+=z9w;r9J+=u1n;r9J+=H1w;var d9J=r7n;E1aa.W2x();d9J+=L0w;var k9J=C8n;k9J+=T8n;var G9J=s8n;G9J+=T9w;G9J+=V5w;var x9J=r7n;x9J+=L0w;var O9J=e4w;O9J+=E1aa[540234];O9J+=D4w;O9J+=L0w;var m9J=f0w;m9J+=D4w;m9J+=T9w;m9J+=V5w;var L9J=f0w;L9J+=D4w;L9J+=b8n;var formHeight;formHeight=self[L9J][e8n]?self[m9J][e8n](self[O9J][h4n]):$(self[x9J][j1n])[p1n]()[X8n]();var maxHeight=$(window)[X8n]() - self[G9J][k9J] * L2l - $(I8n,self[d9J][r9J])[i8n]() - $(D5n,self[B1n][h4n])[g9J]();$(E5n,self[E9J][h4n])[V9J](L5n,maxHeight);return $(self[i1n][Q6w][h4n])[S9J]();},"_hide":function(callback){E1aa.W2x();var J8n="kg";var j8n="Lightbox";var z8n="ightbox_Content_Wrapper";var M8n="tbox";var F8n="div.DTED_L";var U8n="bac";var a8n="click.DTED_L";var o8n="offsetHeig";var B8n="ED_";var i9J=V5n;i9J+=B8n;i9J+=j8n;var I9J=f0w;I9J+=x4n;I9J+=f1n;var X9J=D4w;X9J+=V5w;X9J+=V5w;var e9J=C1w;e9J+=A7n;e9J+=p8n;var b9J=F8n;b9J+=z8n;var s9J=a8n;s9J+=y9w;s9J+=N8n;s9J+=M8n;var T9J=D4w;T9J+=V5w;T9J+=V5w;var C9J=U8n;C9J+=J8n;C9J+=u7n;var N9J=r7n;N9J+=L0w;var R9J=f0w;R9J+=y5n;R9J+=l9w;R9J+=H9w;var f9J=o8n;f9J+=d5w;f9J+=i9w;var A9J=v8n;A9J+=k0w;var P9J=r7n;P9J+=L0w;var K9J=E8n;K9J+=V8n;var t9J=e4w;t9J+=E1aa[540234];t9J+=D4w;t9J+=L0w;if(!callback){callback=function(){};}$(self[t9J][j1n])[K9J]({"top":-(self[P9J][A9J][f9J] + s2l)},z2l,function(){var n8n='normal';var Y8n="backgroun";var u8n="fa";var Q8n="eO";var w9J=u8n;w9J+=E1aa[540234];w9J+=Q8n;w9J+=W8n;var y9J=Y8n;y9J+=E1aa[540234];$([self[B1n][h4n],self[B1n][y9J]])[w9J](n8n,function(){E1aa.W2x();$(this)[e5n]();callback();});});$(self[B1n][R9J])[I5n](I4n);$(self[N9J][C9J])[T9J](s9J);$(b9J,self[B1n][e9J])[X9J](I9J);$(window)[I5n](i9J);},"_findAttachRow":function(){var L3n="modi";var l3n='head';var a9J=f0w;a9J+=z9w;a9J+=c8n;a9J+=S9w;var z9J=x7n;z9J+=H9w;var j9J=f0w;j9J+=z5n;var B9J=V5w;B9J+=T9w;var dt=new $[B9J][Z3n][J3w](self[i1n][l9w][i0n]);if(self[j9J][H3n] === l3n){var F9J=d5w;F9J+=v3n;F9J+=z9w;var p9J=t0n;p9J+=a5w;p9J+=H9w;return dt[p9J]()[F9J]();}else if(self[z9J][l9w][D3n] === a9J){var M9J=t0n;M9J+=h3n;return dt[M9J]()[q3n]();}else {var J9J=L3n;J9J+=m3n;var U9J=e4w;U9J+=N5n;U9J+=H9w;return dt[O3n](self[U9J][l9w][J9J])[x3n]();}},"_dte":p6w,"_ready":R8w,"_cssBackgroundOpacity":q2l,"_dom":{"wrapper":$(G3n + k3n + o9J + T6w)[h2l],"background":$(d3n)[h2l],"close":$(u9J)[h2l],"content":p6w}});self=Editor[Q9J][W9J];self[Y9J]={"windowPadding":s2l,"heightCalc":p6w,"attach":O3n,"windowScroll":s8w};})();Editor[k2w][n9J]=function(cfg,after,reorder){var C3n="eset";var A3n="eld requires";var V3n="aSource";var w3n="Error adding field '";var X3n="der";var B3n="rder";var P3n="Error adding field. The fi";var N3n="R";var R3n="'. A field already exists with this name";var f3n=" a `name` opt";var t3n="reverse";var j3n="Reo";var S3n="ayReord";var G0J=r3n;G0J+=l9w;var L0J=L0w;L0J+=D4w;L0J+=h9w;var q0J=c2l;q0J+=H9w;q0J+=Z9w;q0J+=E1aa[540234];var h0J=m7w;h0J+=g3n;h0J+=Z9w;h0J+=E1aa[540234];var D0J=E3n;E1aa.n2x();D0J+=m7w;D0J+=O7w;var v0J=e4w;v0J+=v9w;v0J+=i9w;v0J+=V3n;if(Array[r0n](cfg)){var H0J=D4w;H0J+=z9w;H0J+=E1aa[540234];H0J+=H1w;var Z0J=t4w;Z0J+=w5w;Z0J+=S3n;Z0J+=H1w;var c9J=A8w;c9J+=F0n;c9J+=d5w;if(after !== undefined){cfg[t3n]();}for(var i=h2l;i < cfg[c9J];i++){this[K3n](cfg[i],after,R8w);}this[Z0J](this[H0J]());return this;}var name=cfg[h6w];if(name === undefined){var l0J=P3n;l0J+=A3n;l0J+=f3n;l0J+=C1n;throw l0J;}if(this[l9w][y3n][name]){throw w3n + name + R3n;}this[v0J](D0J,cfg);var field=new Editor[h0J](cfg,this[i2w][q0J],this);if(this[l9w][L0J]){var m0J=W6w;m0J+=N3n;m0J+=C3n;var editFields=this[l9w][T3n];field[m0J]();$[z9n](editFields,function(idSrc,edit){var s3n="lFromDat";var O0J=G6w;O0J+=N0w;var val;if(edit[O0J]){var x0J=z3w;x0J+=N0w;x0J+=s3n;x0J+=N0w;val=field[x0J](edit[m6w]);}field[b3n](idSrc,val !== undefined?val:field[X1w]());});}this[l9w][G0J][name]=field;if(after === undefined){var k0J=n9w;k0J+=c9w;k0J+=P8w;this[l9w][e3n][k0J](name);}else if(after === p6w){this[l9w][e3n][d2w](name);}else {var d0J=z1w;d0J+=X3n;var idx=$[I3n](after,this[l9w][d0J]);this[l9w][e3n][i3n](idx + q2l,h2l,name);}if(reorder !== R8w){var g0J=D4w;g0J+=B3n;var r0J=t4w;r0J+=T5w;r0J+=j3n;r0J+=B3n;this[r0J](this[g0J]());}return this;};Editor[k2w][E0J]=function(newAjax){var S0J=p3n;S0J+=F3n;if(newAjax){var V0J=N0w;V0J+=C8w;V0J+=F3n;this[l9w][V0J]=newAjax;return this;}E1aa.n2x();return this[l9w][S0J];};Editor[k2w][t0J]=function(){var a3n="onBackground";var K0J=a5w;K0J+=c9w;K0J+=z9w;var onBackground=this[l9w][z3n][a3n];if(typeof onBackground === E1aa[363362]){onBackground(this);}else if(onBackground === K0J){this[M3n]();}else if(onBackground === k1n){this[X4n]();}else if(onBackground === U3n){var P0J=l9w;P0J+=n5w;this[P0J]();}E1aa.n2x();return this;};Editor[k2w][A0J]=function(){var J3n="_b";E1aa.n2x();var f0J=J3n;f0J+=Z9w;f0J+=c9w;f0J+=z9w;this[f0J]();return this;};Editor[y0J][w0J]=function(cells,fieldNames,show,opts){var Y3n="nO";var u3n="ividua";var Q3n="formOpt";var H6n="_t";var W3n="isPlai";var h6n='bubble';var e0J=e4w;e0J+=H9w;e0J+=E1aa[540234];e0J+=F7n;var b0J=o3n;b0J+=u3n;b0J+=Z9w;var s0J=Q3n;s0J+=b0w;var T0J=W3n;T0J+=Y3n;T0J+=n3n;T0J+=i9w;var C0J=c3n;C0J+=Z6n;C0J+=T9w;var R0J=H6n;R0J+=r5w;R0J+=x0w;var that=this;E1aa.W2x();if(this[R0J](function(){var N0J=y5w;N0J+=c9w;N0J+=z5w;N0J+=b5w;that[N0J](cells,fieldNames,opts);})){return this;}if($[l6n](fieldNames)){opts=fieldNames;fieldNames=undefined;show=s8w;}else if(typeof fieldNames === C0J){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[T0J](show)){opts=show;show=s8w;}if(show === undefined){show=s8w;}opts=$[c3w]({},this[l9w][s0J][v6n],opts);var editFields=this[D6n](b0J,cells,fieldNames);this[e0J](cells,editFields,h6n,opts,function(){var x6n="ePo";var r6n="_closeRe";var Y6n="endT";var e6n="div class";var L6n="includ";var O6n="bubbl";var V6n="ssag";var z6n="_formOptio";var M6n='resize.';var T6n="\"><span></div>";var P6n="hildr";var F6n="reop";var B6n="atta";var m6n="eFields";var j6n="bubbleNode";var I6n="div class=\"";var N6n="<div class=\"DTE_";var S6n="prepe";var W6n="pendT";var G6n="sition";var C6n="Processing_Indicator";var f6n="\"><";var u6n="liner";var w6n="ter";var q6n="focu";var J6n='"><div></div></div>';var b1J=q6n;b1J+=l9w;var s1J=L6n;s1J+=m6n;var T1J=O6n;T1J+=x6n;T1J+=G6n;var C1J=f0w;C1J+=Z9w;C1J+=b8w;var N1J=k6n;N1J+=d6n;var A1J=r6n;A1J+=K0w;var P1J=N0w;P1J+=E1aa[540234];P1J+=E1aa[540234];var K1J=N0w;K1J+=g6n;var V1J=y5w;V1J+=E6n;V1J+=l9w;var d1J=x9w;d1J+=V6n;d1J+=H9w;E1aa.W2x();var k1J=E1aa[540234];k1J+=D4w;k1J+=L0w;var G1J=S6n;G1J+=o5w;var x1J=E1aa[540234];x1J+=U8w;var O1J=I0w;O1J+=t6n;var m1J=H9w;m1J+=K6n;var L1J=f0w;L1J+=P6n;L1J+=q5w;var l1J=A6n;l1J+=w1w;l1J+=N3w;var H1J=f6n;H1J+=u8w;H1J+=y9w;H1J+=N3w;var Z1J=n9w;Z1J+=y6n;Z1J+=w6n;var c0J=o8w;c0J+=R6n;c0J+=z3w;c0J+=W8w;var n0J=N6n;n0J+=C6n;n0J+=T6n;var Y0J=i4n;Y0J+=D4w;Y0J+=l9w;Y0J+=H9w;var W0J=s6n;W0J+=g4n;W0J+=E4n;W0J+=b6n;var Q0J=f0w;Q0J+=Z9w;Q0J+=D4w;Q0J+=y4w;var u0J=o8w;u0J+=e6n;u0J+=b6n;var o0J=x8w;o0J+=W8w;var J0J=i9w;J0J+=X6n;J0J+=Z9w;J0J+=H9w;var U0J=o8w;U0J+=I6n;var M0J=x8w;M0J+=W8w;var a0J=o1n;a0J+=S9n;a0J+=r9w;a0J+=z9w;var z0J=y5w;z0J+=K0w;var F0J=i6n;F0J+=o5n;F0J+=x8w;var p0J=O6n;p0J+=H9w;var j0J=B6n;j0J+=I0w;var B0J=f0w;B0J+=T0w;B0J+=f0w;B0J+=y1w;var i0J=j6n;i0J+=l9w;var I0J=p6n;I0J+=F6n;I0J+=H9w;I0J+=T9w;var X0J=z6n;X0J+=a6n;var namespace=that[X0J](opts);var ret=that[I0J](h6n);if(!ret){return that;}$(window)[T0w](M6n + namespace,function(){E1aa.n2x();that[U6n]();});var nodes=[];that[l9w][i0J]=nodes[B0J][q1n](nodes,_pluck(editFields,j0J));var classes=that[i2w][p0J];var background=$(F0J + classes[z0J] + J6n);var container=$(o6n + classes[a0J] + M0J + U0J + classes[u6n] + K6w + o6n + classes[J0J] + o0J + u0J + classes[Q0J] + W0J + that[W0n][Y0J] + R6w + n0J + c0J + T6w + o6n + classes[Z1J] + H1J + l1J);if(show){var q1J=y5w;q1J+=Q6n;q1J+=x0w;var h1J=N0w;h1J+=n9w;h1J+=W6n;h1J+=D4w;var D1J=q4n;D1J+=E1aa[540234];D1J+=x0w;var v1J=S9n;v1J+=n9w;v1J+=Y6n;v1J+=D4w;container[v1J](D1J);background[h1J](q1J);}var liner=container[L1J]()[m1J](h2l);var table=liner[O1J]();var close=table[p1n]();liner[F1n](that[x1J][n6n]);table[G1J](that[k1J][c6n]);if(opts[d1J]){var g1J=z0w;g1J+=L0w;g1J+=Z2n;g1J+=d3w;var r1J=E1aa[540234];r1J+=D4w;r1J+=L0w;liner[a6w](that[r1J][g1J]);}if(opts[N6w]){var E1J=q7w;E1J+=L0w;liner[a6w](that[E1J][q3n]);}if(opts[V1J]){var t1J=y5w;t1J+=c9w;t1J+=H2n;t1J+=l9w;var S1J=E1aa[540234];S1J+=D4w;S1J+=L0w;table[F1n](that[S1J][t1J]);}var pair=$()[K1J](container)[P1J](background);that[A1J](function(submitComplete){that[T4n](pair,{opacity:h2l},function(){var l2n="sed";E1aa.n2x();var D2n="det";if(this === container[h2l]){var R1J=l7n;R1J+=l2n;var w1J=v2n;w1J+=z3w;w1J+=q5w;w1J+=i9w;var y1J=D4w;y1J+=A7w;var f1J=D2n;f1J+=l0n;f1J+=d5w;pair[f1J]();$(window)[y1J](M6n + namespace);that[h2n]();that[w1J](R1J,[h6n]);}});});background[N1J](function(){that[M3n]();});close[C1J](function(){E1aa.n2x();that[q2n]();});that[T1J]();that[T4n](pair,{opacity:q2l});that[L2n](that[l9w][s1J],opts[b1J]);that[m2n](h6n,s8w);});return this;};Editor[e1J][U6n]=function(){var d2n="bubbleNodes";var k2n='div.DTE_Bubble_Liner';var K2n="right";var S2n="eft";var R2n='below';var G2n="E_Bub";var C2n='left';var t2n="bottom";var w2n="botto";var A2n="outerWidth";var O2n="ffset";var S2l=15;var n1J=D4w;n1J+=O2n;var Y1J=Z9w;Y1J+=x2n;var W1J=f0w;W1J+=l9w;W1J+=l9w;var Q1J=z9w;Q1J+=y9w;Q1J+=K0w;Q1J+=H5n;var u1J=i9w;u1J+=D4w;u1J+=n9w;var o1J=Z9w;o1J+=q9n;o1J+=i9w;var J1J=A8w;J1J+=f8w;E1aa.W2x();var U1J=k5w;U1J+=n9w;var I1J=a9n;I1J+=d5w;var X1J=l5n;X1J+=a9w;X1J+=G2n;X1J+=h3n;var wrapper=$(X1J),liner=$(k2n),nodes=this[l9w][d2n];var position={top:h2l,left:h2l,right:h2l,bottom:h2l};$[I1J](nodes,function(i,node){var V2n="righ";var g2n="setWidth";var r2n="setHeig";var M1J=I5n;M1J+=r2n;M1J+=d5w;M1J+=i9w;var a1J=i9w;a1J+=D4w;a1J+=n9w;var z1J=I5n;z1J+=g2n;var F1J=Z9w;F1J+=H9w;F1J+=E2n;var p1J=V2n;p1J+=i9w;var j1J=Z9w;j1J+=S2n;var B1J=Z9w;B1J+=S2n;var i1J=i9w;i1J+=D4w;i1J+=n9w;var pos=$(node)[G8n]();node=$(node)[P0n](h2l);position[x8n]+=pos[i1J];position[B1J]+=pos[j1J];E1aa.W2x();position[p1J]+=pos[F1J] + node[z1J];position[t2n]+=pos[a1J] + node[M1J];});position[U1J]/=nodes[J1J];position[o1J]/=nodes[N8w];position[K2n]/=nodes[N8w];position[t2n]/=nodes[N8w];var top=position[u1J],left=(position[P2n] + position[Q1J]) / L2l,width=liner[A2n](),visLeft=left - width / L2l,visRight=visLeft + width,docWidth=$(window)[f2n](),padding=S2l,classes=this[i2w][v6n];wrapper[W1J]({top:top,left:left});if(liner[Y1J] && liner[n1J]()[x8n] < h2l){var l4J=Q5w;l4J+=y2n;var H4J=w2n;H4J+=L0w;var Z4J=i9w;Z4J+=D4w;Z4J+=n9w;var c1J=f0w;c1J+=l9w;c1J+=l9w;wrapper[c1J](Z4J,position[H4J])[l4J](R2n);}else {wrapper[N2n](R2n);}if(visRight + padding > docWidth){var D4J=Z9w;D4J+=S2n;var v4J=f0w;v4J+=l9w;v4J+=l9w;var diff=visRight - docWidth;liner[v4J](D4J,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {liner[M6w](C2n,visLeft < padding?-(visLeft - padding):h2l);}return this;};Editor[h4J][T2n]=function(buttons){var O4J=y5w;O4J+=c9w;O4J+=s2n;var m4J=E1aa[540234];E1aa.W2x();m4J+=D4w;m4J+=L0w;var that=this;if(buttons === b2n){var L4J=Z5w;L4J+=e2n;var q4J=y9w;q4J+=Y3w;q4J+=X2n;buttons=[{text:this[q4J][this[l9w][D3n]][L4J],action:function(){E1aa.n2x();this[e0n]();}}];}else if(!Array[r0n](buttons)){buttons=[buttons];}$(this[m4J][O4J])[I2n]();$[z9n](buttons,function(i,btn){var U2n="functi";var Q2n="className";var M2n="abind";var a2n="bIndex";var B2n="eypres";var u2n='<button></button>';var i2n="lick";var F2n="In";var p2n="tab";var j2n="ey";var J2n="acti";var R4J=f0w;R4J+=i2n;var w4J=D4w;w4J+=T9w;var A4J=V7w;A4J+=B2n;A4J+=l9w;var K4J=V7w;K4J+=j2n;K4J+=c9w;K4J+=n9w;var t4J=D4w;t4J+=T9w;var S4J=p2n;S4J+=F2n;S4J+=E1aa[540234];S4J+=z2n;var V4J=t0n;V4J+=a2n;var E4J=i9w;E4J+=M2n;E4J+=z2n;var g4J=N0w;g4J+=i9w;g4J+=i9w;g4J+=z9w;var r4J=U2n;r4J+=T0w;var d4J=d5w;d4J+=i9w;d4J+=L0w;d4J+=Z9w;var k4J=V5w;k4J+=T9w;var G4J=J2n;G4J+=T0w;if(typeof btn === o2n){btn={text:btn,action:function(){var x4J=l9w;x4J+=n5w;this[x4J]();}};}var text=btn[m1n] || btn[S6w];var action=btn[G4J] || btn[k4J];$(u2n,{'class':that[i2w][c6n][G1n] + (btn[Q2n]?E6w + btn[Q2n]:H8w)})[d4J](typeof text === r4J?text(that):text || H8w)[g4J](E4J,btn[V4J] !== undefined?btn[S4J]:h2l)[t4J](K4J,function(e){var P4J=W2n;E1aa.n2x();P4J+=Y2n;P4J+=n2n;if(e[P4J] === E2l && action){action[c2n](that);}})[T0w](A4J,function(e){var H9b="preventD";var l9b="efau";var Z9b="yCo";var f4J=W2n;f4J+=Z9b;f4J+=E1aa[540234];f4J+=H9w;if(e[f4J] === E2l){var y4J=H9b;y4J+=l9b;y4J+=Z9w;y4J+=i9w;e[y4J]();}})[w4J](R4J,function(e){var v9b="preventDef";var N4J=v9b;N4J+=S2w;e[N4J]();if(action){action[c2n](that,e);}})[D9b](that[Q6w][T2n]);});return this;};Editor[C4J][h9b]=function(fieldName){var L9b="plice";var s4J=h0n;s4J+=K0w;var T4J=V5w;T4J+=g3n;T4J+=Z9w;T4J+=K5w;var that=this;var fields=this[l9w][T4J];if(typeof fieldName === s4J){var b4J=h9w;b4J+=x9n;b4J+=H4w;b4J+=x0w;that[r3n](fieldName)[b4J]();delete fields[fieldName];var orderIdx=$[I3n](fieldName,this[l9w][e3n]);this[l9w][e3n][i3n](orderIdx,q2l);var includeIdx=$[I3n](fieldName,this[l9w][q9b]);if(includeIdx !== -q2l){var e4J=l9w;e4J+=L9b;this[l9w][q9b][e4J](includeIdx,q2l);}}else {$[z9n](this[m9b](fieldName),function(i,name){var X4J=f0w;X4J+=Z9w;X4J+=H9w;X4J+=O9b;that[X4J](name);});}E1aa.W2x();return this;};Editor[I4J][X4n]=function(){var i4J=e4w;i4J+=X4n;E1aa.n2x();this[i4J](R8w);return this;};Editor[k2w][x9b]=function(arg1,arg2,arg3,arg4){var G9b="itCreate";var K9b="mb";var y9b="_actionClass";var k9b="even";E1aa.W2x();var E9b="ai";var S9b="udArgs";var V9b="_cr";var Y4J=t0w;Y4J+=G9b;var W4J=e4w;W4J+=k9b;W4J+=i9w;var u4J=a9n;u4J+=d5w;var o4J=w1w;o4J+=l9w;o4J+=d9b;var J4J=l9w;J4J+=i9w;J4J+=Q7n;J4J+=H9w;var U4J=V5w;U4J+=D4w;U4J+=z9w;U4J+=L0w;var M4J=r9b;M4J+=g9b;var a4J=l0n;a4J+=i9w;a4J+=C1n;var z4J=L0w;z4J+=E9b;z4J+=T9w;var F4J=V9b;F4J+=S9b;var j4J=t9b;j4J+=K9b;j4J+=H1w;var B4J=P9b;B4J+=A9b;var that=this;var fields=this[l9w][B4J];var count=q2l;if(this[f9b](function(){that[x9b](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === j4J){count=arg1;arg1=arg2;arg2=arg3;}this[l9w][T3n]={};for(var i=h2l;i < count;i++){var p4J=P9b;p4J+=A9b;this[l9w][T3n][i]={fields:this[l9w][p4J]};}var argOpts=this[F4J](arg1,arg2,arg3,arg4);this[l9w][e0w]=z4J;this[l9w][a4J]=x9b;this[l9w][M4J]=p6w;this[Q6w][U4J][J4J][o4J]=Q9n;this[y9b]();this[w9b](this[y3n]());$[u4J](fields,function(name,field){var R9b="multiReset";field[R9b]();for(var i=h2l;i < count;i++){var Q4J=i8w;Q4J+=V2w;Q4J+=y9w;Q4J+=O5w;field[Q4J](i,field[X1w]());}field[H7w](field[X1w]());});this[W4J](Y4J,p6w,function(){var s9b="Mai";var T9b="_assemble";var C9b="beOpen";var c4J=N9b;c4J+=x0w;c4J+=C9b;var n4J=T9b;n4J+=s9b;n4J+=T9w;E1aa.W2x();that[n4J]();that[b9b](argOpts[r2w]);argOpts[c4J]();});return this;};Editor[Z5J][H5J]=function(parent){var e9b="Arra";var I9b="dependent";var L5J=D4w;L5J+=A7w;var q5J=T9w;q5J+=n2n;var h5J=c2l;E1aa.n2x();h5J+=g4w;var l5J=y9w;l5J+=l9w;l5J+=e9b;l5J+=x0w;if(Array[l5J](parent)){var v5J=b5w;v5J+=X9b;v5J+=i9w;v5J+=d5w;for(var i=h2l,ien=parent[v5J];i < ien;i++){var D5J=Y0w;D5J+=I9b;this[D5J](parent[i]);}return this;}var field=this[h5J](parent);$(field[q5J]())[L5J](i9b);return this;};Editor[k2w][m5J]=function(parent,url,opts){var B9b="son";var j9b="epe";var p9b="dent";var w5J=H9w;w5J+=z3w;w5J+=H9w;w5J+=k0w;var y5J=D4w;y5J+=T9w;var f5J=U9n;f5J+=h9w;var k5J=z2n;k5J+=S9w;k5J+=T9w;k5J+=E1aa[540234];var G5J=C8w;G5J+=B9b;var x5J=P9b;x5J+=P5w;if(Array[r0n](parent)){for(var i=h2l,ien=parent[N8w];i < ien;i++){var O5J=E1aa[540234];O5J+=j9b;O5J+=T9w;O5J+=p9b;this[O5J](parent[i],url,opts);}return this;}var that=this;var field=this[x5J](parent);var ajaxOpts={type:F9b,dataType:G5J};opts=$[k5J]({event:z9b,data:p6w,preUpdate:p6w,postUpdate:p6w},opts);var update=function(json){var J9b="sag";var u9b='update';var Q9b='val';var a9b="oces";var U9b="tUpdate";var W9b='error';var M9b="pos";var c9b="postUpd";var o9b="preUpdate";var Y9b='hide';var n9b='show';var A5J=V0w;A5J+=a9b;A5J+=c1w;var K5J=M9b;K5J+=U9b;var S5J=N5w;S5J+=s2w;var V5J=q5w;V5J+=s2w;var g5J=L0w;g5J+=R0w;g5J+=J9b;g5J+=H9w;var r5J=y0w;r5J+=y5w;r5J+=H9w;r5J+=Z9w;E1aa.W2x();var d5J=H9w;d5J+=N0w;d5J+=f0w;d5J+=d5w;if(opts[o9b]){opts[o9b](json);}$[d5J]({labels:r5J,options:u9b,values:Q9b,messages:g5J,errors:W9b},function(jsonProp,fieldFn){E1aa.n2x();if(json[jsonProp]){var E5J=c8n;E5J+=I0w;$[E5J](json[jsonProp],function(field,val){E1aa.W2x();that[r3n](field)[fieldFn](val);});}});$[z9n]([Y9b,n9b,V5J,S5J],function(i,key){E1aa.W2x();if(json[key]){var t5J=E8n;t5J+=y1w;t5J+=H9w;that[key](json[key],json[t5J]);}});if(opts[K5J]){var P5J=c9b;P5J+=V8n;opts[P5J](json);}field[A5J](R8w);};$(field[f5J]())[y5J](opts[w5J] + i9b,function(e){var l0b="itFiel";var L0b="Object";var Z0b="lue";var I5J=G6w;I5J+=N0w;var X5J=z3w;X5J+=N0w;X5J+=Z0b;X5J+=l9w;var e5J=H4w;e5J+=H0b;var b5J=z9w;b5J+=I1n;b5J+=l9w;var s5J=z9w;s5J+=I1n;var T5J=v9w;T5J+=i9w;T5J+=N0w;var C5J=B0w;C5J+=l0b;C5J+=K5w;var N5J=p4n;N5J+=K9n;var R5J=T9w;R5J+=D4w;R5J+=E1aa[540234];R5J+=H9w;if($(field[R5J]())[v0b](e[N5J])[N8w] === h2l){return;}field[o9n](s8w);var data={};data[D0b]=that[l9w][C5J]?_pluck(that[l9w][T3n],T5J):p6w;data[s5J]=data[b5J]?data[e5J][h2l]:p6w;data[X5J]=that[s9n]();if(opts[I5J]){var ret=opts[m6w](data);if(ret){opts[m6w]=ret;}}if(typeof url === E1aa[363362]){var i5J=z3w;i5J+=N0w;i5J+=Z9w;var o=url[c2n](that,field[i5J](),data,update);if(o){if(typeof o === E1aa[186121] && typeof o[h0b] === E1aa[363362]){o[h0b](function(resolved){E1aa.n2x();if(resolved){update(resolved);}});}else {update(o);}}}else {var p5J=p3n;p5J+=N0w;p5J+=e1w;var B5J=q0b;B5J+=L0b;if($[B5J](url)){var j5J=z2n;j5J+=m0b;$[j5J](ajaxOpts,url);}else {ajaxOpts[O0b]=url;}$[p5J]($[c3w](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[k2w][F5J]=function(){var d0b="templa";var g0b='.dte';var r0b="tro";var x0b="roy";var Q5J=E1aa[540234];Q5J+=D4w;Q5J+=L0w;var o5J=h9w;o5J+=x9n;o5J+=x0b;var M5J=f0w;M5J+=Z9w;M5J+=G0b;var z5J=V0n;z5J+=E9n;z5J+=H9w;z5J+=E1aa[540234];if(this[l9w][z5J]){var a5J=i4n;a5J+=S4n;this[a5J]();}this[M5J]();if(this[l9w][k0b]){var J5J=d0b;J5J+=S9w;var U5J=q8n;U5J+=x0w;$(U5J)[F1n](this[l9w][J5J]);}var controller=this[l9w][x1n];E1aa.W2x();if(controller[o5J]){var u5J=E1aa[540234];u5J+=R0w;u5J+=r0b;u5J+=x0w;controller[u5J](this);}$(document)[I5n](g0b + this[l9w][E0b]);this[Q5J]=p6w;this[l9w]=p6w;};Editor[W5J][Y5J]=function(name){var n5J=c8n;n5J+=I0w;var that=this;$[n5J](this[m9b](name),function(i,n){var V0b="disab";var c5J=V0b;c5J+=b5w;that[r3n](n)[c5J]();});return this;};Editor[Z7J][H7J]=function(show){E1aa.n2x();var l7J=D4w;l7J+=t9n;if(show === undefined){return this[l9w][S0b];}return this[show?l7J:k1n]();};Editor[v7J][D7J]=function(){return $[t0b](this[l9w][y3n],function(field,name){var K0b="displaye";E1aa.n2x();var h7J=K0b;h7J+=E1aa[540234];return field[h7J]()?name:p6w;});};Editor[k2w][q7J]=function(){E1aa.n2x();return this[l9w][x1n][x3n](this);};Editor[L7J][m7J]=function(items,arg1,arg2,arg3,arg4){E1aa.W2x();var P0b="_crudArgs";var x7J=L0w;x7J+=N0w;x7J+=y9w;x7J+=T9w;var O7J=c2l;O7J+=H9w;O7J+=A9b;var that=this;if(this[f9b](function(){E1aa.W2x();that[x6w](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[P0b](arg1,arg2,arg3,arg4);this[A0b](items,this[D6n](O7J,items),x7J,argOpts[r2w],function(){var G7J=D4w;G7J+=n9w;G7J+=i9w;G7J+=l9w;that[f0b]();that[b9b](argOpts[G7J]);argOpts[y0b]();});return this;};Editor[k7J][d7J]=function(name){var w0b="_fieldNam";var g7J=w0b;g7J+=R0w;var r7J=H9w;r7J+=N0w;r7J+=f0w;r7J+=d5w;var that=this;$[r7J](this[g7J](name),function(i,n){var V7J=H9w;V7J+=T9w;V7J+=s2w;E1aa.W2x();var E7J=c2l;E7J+=g4w;that[E7J](n)[V7J]();});return this;};Editor[k2w][a2w]=function(name,msg){var C0b="mEr";var b0b="ag";var R0b="glob";var s0b="_mess";E1aa.W2x();var S7J=o1n;S7J+=u1n;S7J+=H1w;var wrapper=$(this[Q6w][S7J]);if(msg === undefined){var A7J=R0b;A7J+=N0w;A7J+=Z9w;A7J+=N0b;var K7J=V5w;K7J+=z1w;K7J+=C0b;K7J+=T0b;var t7J=s0b;t7J+=b0b;t7J+=H9w;this[t7J](this[Q6w][K7J],name,s8w,function(){var e0b="inForm";var P7J=e0b;P7J+=d0w;P7J+=I0n;wrapper[n0n](P7J,name !== undefined && name !== H8w);});this[l9w][A7J]=name;}else {var y7J=H9w;y7J+=I0n;var f7J=V5w;f7J+=y9w;f7J+=H9w;f7J+=P5w;this[f7J](name)[y7J](msg);}return this;};Editor[w7J][R7J]=function(name){var X0b='Unknown field name - ';var fields=this[l9w][y3n];if(!fields[name]){throw X0b + name;}return fields[name];};Editor[N7J][C7J]=function(){var s7J=r3n;s7J+=l9w;var T7J=L0w;T7J+=S9n;return $[T7J](this[l9w][s7J],function(field,name){return name;});};Editor[b7J][g8w]=_api_file;Editor[k2w][e7J]=_api_files;Editor[X7J][I7J]=function(name){var B7J=I0b;B7J+=E9n;var that=this;if(!name){var i7J=V5w;i7J+=y9w;i7J+=i0b;name=this[i7J]();}if(Array[B7J](name)){var out={};$[z9n](name,function(i,n){E1aa.W2x();out[n]=that[r3n](n)[P0n]();});return out;}return this[r3n](name)[P0n]();};Editor[j7J][p7J]=function(names,animate){var that=this;$[z9n](this[m9b](names),function(i,n){var F7J=d5w;E1aa.n2x();F7J+=y9w;F7J+=E1aa[540234];F7J+=H9w;that[r3n](n)[F7J](animate);});return this;};Editor[k2w][B0b]=function(includeHash){var a7J=H9w;a7J+=j0b;a7J+=k7w;a7J+=i0b;var z7J=L0w;z7J+=N0w;z7J+=n9w;return $[z7J](this[l9w][a7J],function(edit,idSrc){return includeHash === s8w?p0b + idSrc:idSrc;});};Editor[M7J][U7J]=function(inNames){var z0b="globalError";var J7J=Z9w;J7J+=F0b;J7J+=d5w;var formError=$(this[Q6w][n6n]);if(this[l9w][z0b]){return s8w;}var names=this[m9b](inNames);for(var i=h2l,ien=names[J7J];i < ien;i++){var o7J=y9w;o7J+=T9w;o7J+=N0b;if(this[r3n](names[i])[o7J]()){return s8w;}}return R8w;};Editor[k2w][u7J]=function(cell,fieldName,opts){var J0b=".DTE_F";var a0b="nl";var o0b="las";var Y0b="inline";var u0b="ses";var h8J=y9w;h8J+=a0b;h8J+=M0b;var D8J=v2n;D8J+=E1aa[540234];D8J+=F7n;var l8J=U0b;l8J+=J0b;l8J+=O7w;var Y7J=c8n;Y7J+=f0w;Y7J+=d5w;var W7J=f0w;W7J+=o0b;W7J+=u0b;var Q7J=Q0b;Q7J+=W0b;var that=this;if($[l6n](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[c3w]({},this[l9w][Q7J][Y0b],opts);var editFields=this[D6n](n0b,cell,fieldName);var node,field;var countOuter=h2l,countInner;var closed=R8w;var classes=this[W7J][Y0b];$[Y7J](editFields,function(i,editField){var c0b="tta";var H1b="t edit more tha";var Z1b="Canno";var l1b="n one row inline at a time";var Z8J=H9w;Z8J+=N0w;Z8J+=I0w;var c7J=N0w;c7J+=c0b;c7J+=I0w;if(countOuter > h2l){var n7J=Z1b;n7J+=H1b;n7J+=l1b;throw n7J;}node=$(editField[c7J][h2l]);countInner=h2l;$[Z8J](editField[v1b],function(j,f){var D1b="Cannot edit more";var q1b="ine at a tim";var h1b=" than one field inl";if(countInner > h2l){var H8J=D1b;H8J+=h1b;H8J+=q1b;H8J+=H9w;throw H8J;}field=f;countInner++;});countOuter++;;});if($(l8J,node)[N8w]){return this;}if(this[f9b](function(){var v8J=L1b;v8J+=w9w;that[v8J](cell,fieldName,opts);})){return this;}this[D8J](cell,editFields,h8J,opts,function(){var R1b='px"';var X1b="_closeReg";var V1b="e=\"width";var E1b="<div class";var t1b="dg";var A1b="Ag";var C1b='<div class="DTE_Processing_Indicator"><span></span></div>';var s1b="rep";var N1b='" ';var y1b="pti";var d1b="\">";var f1b="_formO";var K1b="Of";var P1b="user";var g1b="lin";var O1b="cu";var m1b="nlin";var F8J=y9w;F8J+=m1b;F8J+=H9w;var p8J=V5w;p8J+=D4w;p8J+=O1b;p8J+=l9w;var y8J=x1b;y8J+=G1b;var f8J=E1aa[540234];f8J+=D4w;f8J+=L0w;var A8J=s1w;A8J+=T9w;A8J+=H9w;A8J+=z9w;var P8J=E1aa[540234];P8J+=y9w;P8J+=z3w;P8J+=k1b;var K8J=V5w;K8J+=y9w;K8J+=T9w;K8J+=E1aa[540234];var t8J=R3w;t8J+=N3w;var S8J=d1b;S8J+=A6n;S8J+=r1b;var V8J=o8w;V8J+=m3w;var E8J=g1b;E8J+=H1w;var g8J=x8w;g8J+=W8w;var r8J=E1b;r8J+=b6n;var d8J=P4n;d8J+=o5w;var k8J=Z8n;k8J+=V1b;k8J+=S1b;var G8J=d0w;G8J+=t1b;G8J+=H9w;E1aa.W2x();G8J+=y3w;var x8J=t0w;x8J+=E1aa[540234];x8J+=z2n;x8J+=K1b;var O8J=P1b;O8J+=A1b;O8J+=B5w;var m8J=j1n;m8J+=l9w;var L8J=L1b;L8J+=w9w;var q8J=f1b;q8J+=y1b;q8J+=T0w;q8J+=l9w;var namespace=that[q8J](opts);var ret=that[w1b](L8J);if(!ret){return that;}var children=node[m8J]()[e5n]();var style=navigator[O8J][x8J](G8J) !== -q2l?k8J + node[f2n]() + R1b:H8w;node[d8J]($(r8J + classes[h4n] + g8J + o6n + classes[E8J] + N1b + style + q0n + C1b + V8J + o6n + classes[T2n] + S8J + t8J));node[K8J](P8J + classes[A8J][L0n](/ /g,T1b))[F1n](field[x3n]())[F1n](that[f8J][n6n]);if(opts[y8J]){var N8J=E1aa[540234];N8J+=D4w;N8J+=L0w;var R8J=s1b;R8J+=Z9w;R8J+=b1b;var w8J=F5w;w8J+=s2n;node[v0b](e1b + classes[w8J][R8J](/ /g,T1b))[F1n](that[N8J][T2n]);}that[X1b](function(submitComplete,action){var I1b="inl";var j1b="contents";var s8J=I1b;s8J+=M0b;var C8J=H9w;C8J+=E1aa[540234];C8J+=y9w;C8J+=i9w;closed=s8w;$(document)[I5n](i1b + namespace);if(!submitComplete || action !== C8J){var T8J=E1aa[540234];T8J+=H9w;T8J+=B1b;T8J+=d5w;node[j1b]()[T8J]();node[F1n](children);}that[h2n]();return s8J;;});setTimeout(function(){var b8J=D4w;b8J+=T9w;if(closed){return;}E1aa.n2x();$(document)[b8J](i1b + namespace,function(e){var p1b="ddBack";var z1b='andSelf';var j8J=B0n;j8J+=l9w;var B8J=t0n;B8J+=z9w;B8J+=P0n;var i8J=J1n;i8J+=l9w;E1aa.n2x();var I8J=e4w;I8J+=i9w;I8J+=J1w;I8J+=t2w;var X8J=N0w;X8J+=p1b;var e8J=V5w;e8J+=T9w;var back=$[e8J][F1b]?X8J:z1b;if(!field[I8J](i8J,e[a1b]) && $[I3n](node[h2l],$(e[B8J])[j8J]()[back]()) === -q2l){that[M3n]();}});},h2l);that[L2n]([field],opts[p8J]);that[m2n](F8J,s8w);});return this;};Editor[k2w][l3w]=function(name,msg){var M1b="mIn";if(msg === undefined){var a8J=z0w;a8J+=M1b;a8J+=H0w;var z8J=e4w;z8J+=U1b;z8J+=E5w;this[z8J](this[Q6w][a8J],name);}else {this[r3n](name)[l3w](msg);}return this;};Editor[k2w][e0w]=function(mode){var Q1b='Changing from create mode is not supported';var u1b="n editing mode";var J1b="Not curre";E1aa.n2x();var o1b="ntly in a";if(!mode){return this[l9w][D3n];}if(!this[l9w][D3n]){var M8J=J1b;M8J+=o1b;M8J+=u1b;throw new Error(M8J);}else if(this[l9w][D3n] === j6w && mode !== j6w){throw new Error(Q1b);}this[l9w][D3n]=mode;return this;};Editor[U8J][W1b]=function(){var J8J=h7w;J8J+=w1w;J8J+=m3n;return this[l9w][J8J];};Editor[o8J][Y1b]=function(fieldNames){var W8J=P9b;W8J+=Z9w;W8J+=E1aa[540234];var that=this;if(fieldNames === undefined){var u8J=V5w;u8J+=g3n;u8J+=P5w;u8J+=l9w;fieldNames=this[u8J]();}if(Array[r0n](fieldNames)){var out={};$[z9n](fieldNames,function(i,name){E1aa.n2x();var n1b="multiGe";var Q8J=n1b;Q8J+=i9w;out[name]=that[r3n](name)[Q8J]();});return out;}return this[W8J](fieldNames)[Y1b]();};Editor[k2w][Y8J]=function(fieldNames,val){var that=this;if($[l6n](fieldNames) && val === undefined){var n8J=H9w;n8J+=N0w;n8J+=f0w;n8J+=d5w;$[n8J](fieldNames,function(name,value){var c1b="ltiSet";var Z3J=L0w;Z3J+=c9w;Z3J+=c1b;var c8J=V5w;c8J+=g3n;c8J+=Z9w;E1aa.W2x();c8J+=E1aa[540234];that[c8J](name)[Z3J](value);});}else {var H3J=c2l;H3J+=g4w;this[H3J](fieldNames)[b3n](val);}return this;};Editor[k2w][x3n]=function(name){var q3J=U9n;q3J+=h9w;var h3J=V5w;h3J+=g3n;h3J+=Z9w;h3J+=E1aa[540234];var v3J=L0w;v3J+=N0w;v3J+=n9w;var l3J=I0b;l3J+=E9n;var that=this;if(!name){name=this[e3n]();}return Array[l3J](name)?$[v3J](name,function(n){var D3J=c2l;E1aa.W2x();D3J+=H9w;D3J+=P5w;return that[D3J](n)[x3n]();}):this[h3J](name)[q3J]();};Editor[k2w][I5n]=function(name,fn){var Z4b="_eventNa";var m3J=Z4b;m3J+=x9w;var L3J=D4w;L3J+=V5w;L3J+=V5w;$(this)[L3J](this[m3J](name),fn);return this;};Editor[O3J][T0w]=function(name,fn){E1aa.W2x();var H4b="eventName";var G3J=e4w;G3J+=H4b;var x3J=D4w;x3J+=T9w;$(this)[x3J](this[G3J](name),fn);return this;};Editor[k2w][k3J]=function(name,fn){var v4b="Name";var r3J=l4b;r3J+=q5w;r3J+=i9w;r3J+=v4b;var d3J=D4w;d3J+=T9w;d3J+=H9w;$(this)[d3J](this[r3J](name),fn);return this;};Editor[k2w][g3J]=function(){var m4b="playReorder";var h4b="displayControll";var q4b="seReg";var D4b="_pos";var L4b="_dis";var r4b="open";var s3J=L0w;s3J+=N0w;s3J+=y9w;s3J+=T9w;var T3J=D4b;T3J+=k5w;T3J+=t9n;var A3J=q7w;A3J+=L0w;var P3J=h4b;P3J+=H1w;var K3J=N9b;K3J+=t0w;E1aa.n2x();var V3J=f4w;V3J+=q4b;var E3J=L4b;E3J+=m4b;var that=this;this[E3J]();this[V3J](function(){var S3J=i4n;S3J+=S4n;that[l9w][x1n][S3J](that,function(){var O4b="_clearDynamic";var x4b="Info";var t3J=O4b;t3J+=x4b;E1aa.n2x();that[t3J]();that[G4b](k4b,[d4b]);});});var ret=this[w1b](K3J);if(!ret){return this;}this[l9w][P3J][r4b](this,this[A3J][h4n],function(){var E4b="tO";E1aa.W2x();var C3J=X4w;C3J+=C1n;var N3J=L0w;N3J+=N0w;N3J+=t0w;var R3J=h5w;R3J+=H9w;R3J+=T9w;R3J+=B0w;var w3J=v2n;w3J+=z3w;w3J+=q5w;w3J+=i9w;var y3J=g4b;y3J+=E4b;y3J+=n9w;y3J+=Z0n;var f3J=x4w;f3J+=v9n;f3J+=c9w;f3J+=l9w;that[f3J]($[t0b](that[l9w][e3n],function(name){E1aa.W2x();return that[l9w][y3n][name];}),that[l9w][y3J][D2w]);that[w3J](R3J,[N3J,that[l9w][C3J]]);});this[T3J](s3J,R8w);return this;};Editor[b3J][e3n]=function(set){var S4b="sl";var K4b="ord";var A4b="sort";var t4b="so";var f4b="All fields, and no additional fields, must be provided for ordering.";var z3J=H9w;z3J+=V4b;z3J+=H9w;z3J+=o5w;var F3J=C8w;F3J+=D4w;F3J+=y9w;F3J+=T9w;var p3J=S4b;p3J+=y9w;p3J+=G2w;var j3J=C8w;j3J+=D4w;j3J+=y9w;j3J+=T9w;var B3J=t4b;B3J+=z9w;B3J+=i9w;var i3J=l9w;i3J+=s1w;i3J+=G2w;var X3J=A8w;X3J+=f8w;if(!set){var e3J=K4b;e3J+=H9w;e3J+=z9w;return this[l9w][e3J];}if(arguments[X3J] && !Array[r0n](set)){var I3J=h4w;I3J+=H9w;set=Array[I3J][D1n][c2n](arguments);}if(this[l9w][e3n][i3J]()[B3J]()[j3J](P4b) !== set[p3J]()[A4b]()[F3J](P4b)){throw f4b;}$[z3J](this[l9w][e3n],set);this[w9b]();return this;};Editor[a3J][f0n]=function(items,arg1,arg2,arg3,arg4){var w4b="yle";var N4b="Args";var C4b='initRemove';var T4b='node';var y4b="_act";var R4b="_crud";var c3J=E1aa[540234];c3J+=N0w;c3J+=t0n;var n3J=l4b;n3J+=B5w;var Y3J=y4b;Y3J+=I4w;var W3J=T9w;W3J+=D4w;W3J+=w9w;E1aa.n2x();var Q3J=V0n;Q3J+=E9n;var u3J=l9w;u3J+=i9w;u3J+=w4b;var o3J=E1aa[540234];o3J+=D4w;o3J+=L0w;var J3J=N0w;J3J+=f0w;J3J+=g4n;J3J+=T0w;var U3J=r3n;U3J+=l9w;var M3J=R4b;M3J+=N4b;var that=this;if(this[f9b](function(){E1aa.W2x();that[f0n](items,arg1,arg2,arg3,arg4);})){return this;}if(items[N8w] === undefined){items=[items];}var argOpts=this[M3J](arg1,arg2,arg3,arg4);var editFields=this[D6n](U3J,items);this[l9w][J3J]=f0n;this[l9w][W1b]=items;this[l9w][T3n]=editFields;this[o3J][c6n][u3J][Q3J]=W3J;this[Y3J]();this[n3J](C4b,[_pluck(editFields,T4b),_pluck(editFields,c3J),items],function(){var s4b="itM";var b4b="ultiRemove";var H6J=t0w;H6J+=s4b;H6J+=b4b;var Z6J=v2n;Z6J+=z3w;Z6J+=q5w;Z6J+=i9w;E1aa.n2x();that[Z6J](H6J,[editFields,items],function(){var e4b="ssembleMain";var v6J=V5w;v6J+=D4w;v6J+=G4w;var l6J=t4n;l6J+=e4b;that[l6J]();that[b9b](argOpts[r2w]);argOpts[y0b]();var opts=that[l9w][z3n];if(opts[v6J] !== p6w){var L6J=V5w;L6J+=v9n;L6J+=c9w;L6J+=l9w;var q6J=y5w;q6J+=E6n;q6J+=l9w;var h6J=E1aa[540234];h6J+=D4w;h6J+=L0w;var D6J=x1b;D6J+=T0w;$(D6J,that[h6J][q6J])[X4b](opts[L6J])[D2w]();}});});return this;};Editor[k2w][m6J]=function(set,val){var O6J=H9w;O6J+=l0n;O6J+=d5w;var that=this;if(!$[l6n](set)){var o={};o[set]=val;set=o;}$[O6J](set,function(n,v){var G6J=l9w;G6J+=K9n;var x6J=V5w;x6J+=O7w;E1aa.n2x();that[x6J](n)[G6J](v);});return this;};Editor[k6J][I4b]=function(names,animate){var d6J=H9w;d6J+=i4b;var that=this;E1aa.n2x();$[d6J](this[m9b](names),function(i,n){var r6J=l9w;E1aa.n2x();r6J+=d5w;r6J+=D4w;r6J+=C1w;that[r3n](n)[r6J](animate);});return this;};Editor[g6J][E6J]=function(successCallback,errorCallback,formatdata,hide){var B4b="cessing";var y6J=H9w;y6J+=N0w;y6J+=I0w;var A6J=W2w;A6J+=D4w;A6J+=z9w;var S6J=k4w;S6J+=B4b;var V6J=c2l;V6J+=i0b;var that=this,fields=this[l9w][V6J],errorFields=[],errorReady=h2l,sent=R8w;if(this[l9w][S6J] || !this[l9w][D3n]){return this;}E1aa.W2x();this[j4b](s8w);var send=function(){var p4b="initSu";var t6J=p4b;t6J+=e2n;if(errorFields[N8w] !== errorReady || sent){return;}that[G4b](t6J,[that[l9w][D3n]],function(result){var a4b="ocessi";var P6J=e4w;P6J+=l9w;E1aa.W2x();P6J+=F4b;P6J+=i9w;if(result === R8w){var K6J=z4b;K6J+=a4b;K6J+=X9b;that[K6J](R8w);return;}sent=s8w;that[P6J](successCallback,errorCallback,formatdata,hide);});};this[A6J]();$[z9n](fields,function(name,field){E1aa.W2x();var M4b="inError";if(field[M4b]()){var f6J=n9w;f6J+=c9w;f6J+=l9w;f6J+=d5w;errorFields[f6J](name);}});$[y6J](errorFields,function(i,name){E1aa.n2x();var w6J=H9w;w6J+=I0n;fields[name][w6J](H8w,function(){errorReady++;E1aa.W2x();send();});});send();return this;};Editor[R6J][k0b]=function(set){if(set === undefined){return this[l9w][k0b];}this[l9w][k0b]=set === p6w?p6w:$(set);return this;};Editor[k2w][N6J]=function(title){var o4b="hea";var U4b="uncti";var X6J=d5w;X6J+=i9w;X6J+=L0w;X6J+=Z9w;var s6J=V5w;s6J+=U4b;s6J+=T0w;var T6J=f0w;T6J+=T0w;T6J+=J4b;T6J+=i9w;var C6J=o4b;C6J+=E1aa[540234];C6J+=H9w;C6J+=z9w;var header=$(this[Q6w][q3n])[p1n](e1b + this[i2w][C6J][T6J]);if(title === undefined){return header[P9n]();}if(typeof title === s6J){var e6J=i9w;e6J+=N0w;e6J+=y5w;e6J+=b5w;var b6J=v1w;b6J+=n9w;b6J+=y9w;title=title(this,new DataTable[b6J](this[l9w][e6J]));}header[X6J](title);return this;};Editor[I6J][i6J]=function(field,value){var u4b="isP";E1aa.W2x();var Q4b="lainO";var B6J=u4b;B6J+=Q4b;B6J+=n3n;B6J+=i9w;if(value !== undefined || $[B6J](field)){var j6J=l9w;j6J+=K9n;return this[j6J](field,value);}return this[P0n](field);;};var apiRegister=DataTable[J3w][W4b];function __getInst(api){var Y4b="context";var n4b="oInit";var ctx=api[Y4b][h2l];return ctx[n4b][c4b] || ctx[Z5b];}function __setBasic(inst,opts,type,plural){var q5b="place";var G5b='1';var x5b=/%d/;var z6J=g4n;z6J+=i9w;z6J+=Z9w;z6J+=H9w;var p6J=H5b;p6J+=k5w;p6J+=T9w;p6J+=l9w;if(!opts){opts={};}if(opts[p6J] === undefined){var F6J=l5b;F6J+=T9w;F6J+=l9w;opts[F6J]=b2n;}if(opts[z6J] === undefined){var M6J=y9w;M6J+=v5b;M6J+=T9w;var a6J=i9w;a6J+=y9w;a6J+=D5b;a6J+=H9w;opts[a6J]=inst[M6J][type][N6w];}if(opts[l3w] === undefined){var U6J=x3w;U6J+=L0w;U6J+=h5b;U6J+=H9w;if(type === U6J){var u6J=x3w;u6J+=q5b;var o6J=L5b;o6J+=m5b;var J6J=p7n;J6J+=n3w;J6J+=T9w;var confirm=inst[J6J][type][O5b];opts[o6J]=plural !== q2l?confirm[e4w][u6J](x5b,plural):confirm[G5b];}else {var Q6J=L0w;Q6J+=R0w;Q6J+=l9w;Q6J+=k5b;opts[Q6J]=H8w;}}return opts;}apiRegister(d5b,function(){E1aa.W2x();return __getInst(this);});apiRegister(W6J,function(opts){var r5b="rea";var Y6J=f0w;Y6J+=r5b;Y6J+=i9w;Y6J+=H9w;var inst=__getInst(this);inst[x9b](__setBasic(inst,opts,Y6J));return this;});apiRegister(g5b,function(opts){var c6J=B0w;c6J+=F7n;var n6J=H9w;n6J+=E1aa[540234];n6J+=y9w;n6J+=i9w;var inst=__getInst(this);inst[n6J](this[h2l][h2l],__setBasic(inst,opts,c6J));return this;});apiRegister(E5b,function(opts){var inst=__getInst(this);inst[x6w](this[h2l],__setBasic(inst,opts,V5b));return this;});apiRegister(Z2J,function(opts){var l2J=x3w;E1aa.W2x();l2J+=L0w;l2J+=D4w;l2J+=a5n;var H2J=x3w;H2J+=L0w;H2J+=h5b;H2J+=H9w;var inst=__getInst(this);inst[H2J](this[h2l][h2l],__setBasic(inst,opts,l2J,q2l));return this;});apiRegister(S5b,function(opts){var inst=__getInst(this);inst[f0n](this[h2l],__setBasic(inst,opts,t5b,this[h2l][N8w]));return this;});apiRegister(K5b,function(type,opts){if(!type){type=P5b;}else if($[l6n](type)){var v2J=L1b;v2J+=w9w;opts=type;type=v2J;}E1aa.W2x();__getInst(this)[type](this[h2l][h2l],opts);return this;});apiRegister(D2J,function(opts){E1aa.W2x();__getInst(this)[v6n](this[h2l],opts);return this;});apiRegister(A5b,_api_file);apiRegister(f5b,_api_files);$(document)[T0w](y5b,function(e,ctx,json){var w5b='dt';var h2J=h6w;h2J+=l9w;h2J+=n9w;E1aa.n2x();h2J+=b1b;if(e[h2J] !== w5b){return;}if(json && json[E8w]){var q2J=V5w;q2J+=y9w;q2J+=Z9w;q2J+=R0w;$[z9n](json[q2J],function(name,files){if(!Editor[E8w][name]){var L2J=R5b;L2J+=R0w;Editor[L2J][name]={};}E1aa.W2x();$[c3w](Editor[E8w][name],files);});}});Editor[a2w]=function(msg,tn){var N5b=' For more information, please refer to https://datatables.net/tn/';E1aa.W2x();throw tn?msg + N5b + tn:msg;};Editor[m2J]=function(data,props,fn){var C5b="bel";var G2J=z3w;G2J+=p8w;var x2J=y0w;x2J+=C5b;var O2J=z2n;O2J+=S9w;O2J+=o5w;var i,ien,dataPoint;props=$[O2J]({label:x2J,value:G2J},props);if(Array[r0n](data)){var k2J=A8w;k2J+=f8w;for((i=h2l,ien=data[k2J]);i < ien;i++){var d2J=T5b;d2J+=C0w;dataPoint=data[i];if($[d2J](dataPoint)){var r2J=Z9w;r2J+=M8w;r2J+=Z9w;fn(dataPoint[props[s5b]] === undefined?dataPoint[props[S6w]]:dataPoint[props[s5b]],dataPoint[props[r2J]],i,dataPoint[b5b]);}else {fn(dataPoint,dataPoint,i);}}}else {i=h2l;$[z9n](data,function(key,val){E1aa.W2x();fn(val,key,i);i++;});}};Editor[g2J]=function(id){var e5b="replac";var E2J=e5b;E2J+=H9w;E1aa.W2x();return id[E2J](/\./g,P4b);};Editor[X5b]=function(editor,conf,files,progressCallback,completeCallback){var M5b="fileReadText";var M7b="_l";var z5b="d while uploading the file";var U5b="onload";var i5b="ading ";var U7b="itLeft";var G7b="readAsDataURL";var j5b="A server";var F5b="ccurre";var p5b=" error o";var I5b="i>Uplo";var B5b="file</i>";var E96=L0w;E96+=N0w;E96+=n9w;var V2J=o8w;V2J+=I5b;V2J+=i5b;V2J+=B5b;var reader=new FileReader();var counter=h2l;var ids=[];var generalError=j5b;generalError+=p5b;generalError+=F5b;generalError+=z5b;editor[a2w](conf[h6w],H8w);if(typeof conf[a5b] === E1aa[363362]){conf[a5b](files,function(ids){completeCallback[c2n](editor,ids);});return;}progressCallback(conf,conf[M5b] || V2J);reader[U5b]=function(e){var W5b="ajaxDa";var Z7b="ctio";var D7b="load";var o5b="t.DTE_Upload";var n5b="plo";var J5b="preSubm";var v7b="ajaxData";var O7b="Please use it as a function instead.";var x7b='preUpload';var d7b='json';var q7b='No Ajax option specified for upload plug-in';var l7b='upload';var c5b="adField";var k7b='post';var m7b="jax.data` with an object. ";var L7b="Upload feature cannot use `a";var z2J=H9w;z2J+=V4b;z2J+=i5w;var F2J=N0w;F2J+=C8w;F2J+=N0w;F2J+=e1w;var p2J=J5b;p2J+=y9w;p2J+=o5b;var B2J=T9w;B2J+=N0w;B2J+=L0w;B2J+=H9w;var i2J=u5b;i2J+=i9w;var b2J=g2w;b2J+=Z7w;var s2J=E1aa[540234];s2J+=M3w;var C2J=l9w;C2J+=Q5b;var w2J=T5b;w2J+=C0w;var y2J=N0w;y2J+=C8w;y2J+=N0w;y2J+=e1w;var f2J=W5b;f2J+=t0n;var A2J=N0w;A2J+=H4n;A2J+=o5w;var P2J=T9w;P2J+=Y5b;var K2J=c9w;K2J+=n5b;K2J+=c5b;var t2J=N0w;t2J+=Z7b;t2J+=T9w;var S2J=N0w;S2J+=n9w;S2J+=H7b;var data=new FormData();var ajax;data[S2J](t2J,l7b);data[F1n](K2J,conf[P2J]);data[A2J](l7b,files[counter]);if(conf[f2J]){conf[v7b](data,files[counter],counter);}if(conf[y2J]){ajax=conf[a5b];}else if($[w2J](editor[l9w][a5b])){var N2J=c9w;N2J+=n9w;N2J+=D7b;var R2J=p3n;R2J+=N0w;R2J+=e1w;ajax=editor[l9w][R2J][N2J]?editor[l9w][a5b][X5b]:editor[l9w][a5b];}else if(typeof editor[l9w][a5b] === C2J){var T2J=N0w;T2J+=h7b;ajax=editor[l9w][T2J];}if(!ajax){throw new Error(q7b);}if(typeof ajax === o2n){ajax={url:ajax};}if(typeof ajax[s2J] === b2J){var e2J=h0n;e2J+=K0w;var d={};var ret=ajax[m6w](d);if(ret !== undefined && typeof ret !== e2J){d=ret;}$[z9n](d,function(key,value){var X2J=S9n;X2J+=H7b;data[X2J](key,value);});}else if($[l6n](ajax[m6w])){var I2J=L7b;I2J+=m7b;I2J+=O7b;throw new Error(I2J);}var preRet=editor[i2J](x7b,[conf[B2J],files[counter],data]);if(preRet === R8w){if(counter < files[N8w] - q2l){counter++;reader[G7b](files[counter]);}else {var j2J=f0w;j2J+=N0w;j2J+=Z9w;j2J+=Z9w;completeCallback[j2J](editor,ids);}return;}var submit=R8w;editor[T0w](p2J,function(){submit=s8w;E1aa.n2x();return R8w;});$[F2J]($[z2J]({},ajax,{type:k7b,data:data,dataType:d7b,contentType:R8w,processData:R8w,xhr:function(){var g7b="hr";var V7b="gress";var y7b="onloadend";var E7b="ajaxSettings";var M2J=r7b;M2J+=Q5w;var a2J=e1w;E1aa.n2x();a2J+=g7b;var xhr=$[E7b][a2J]();if(xhr[M2J]){var U2J=D4w;U2J+=F6w;U2J+=H4w;U2J+=V7b;xhr[X5b][U2J]=function(e){var A7b="%";var S7b="lengthComputable";E1aa.n2x();var K7b="total";var f7b=':';var t7b="loaded";var P7b="toFixed";if(e[S7b]){var percent=(e[t7b] / e[K7b] * I2l)[P7b](h2l) + A7b;progressCallback(conf,files[N8w] === q2l?percent:counter + f7b + files[N8w] + E6w + percent);}};xhr[X5b][y7b]=function(e){var w7b="Proces";var R7b="processingText";var J2J=w7b;J2J+=c1w;progressCallback(conf,conf[R7b] || J2J);};}return xhr;},success:function(json){var i7b="ldErrors";var s7b="ors";var B7b="tatu";var T7b="ldErr";var b7b="ploa";var I7b='preSubmit.DTE_Upload';var e7b="dXhrSucc";var v96=y9w;v96+=E1aa[540234];var l96=c9w;l96+=n9w;l96+=N7b;l96+=E1aa[540234];var Y2J=b5w;Y2J+=C7b;var W2J=P9b;W2J+=T7b;W2J+=s7b;var Q2J=t5w;Q2J+=E1aa[540234];Q2J+=Z6w;Q2J+=s7b;var u2J=c9w;E1aa.W2x();u2J+=b7b;u2J+=e7b;u2J+=X7b;var o2J=v2n;o2J+=z3w;o2J+=q5w;o2J+=i9w;editor[I5n](I7b);editor[o2J](u2J,[conf[h6w],json]);if(json[Q2J] && json[W2J][Y2J]){var n2J=P9b;n2J+=i7b;var errors=json[n2J];for(var i=h2l,ien=errors[N8w];i < ien;i++){var Z96=l9w;Z96+=B7b;Z96+=l9w;var c2J=H1w;c2J+=T0b;editor[c2J](errors[i][h6w],errors[i][Z96]);}}else if(json[a2w]){var H96=H1w;H96+=H4w;H96+=z9w;editor[a2w](json[H96]);}else if(!json[X5b] || !json[l96][v96]){var h96=T9w;h96+=N0w;h96+=x9w;var D96=H9w;D96+=z9w;D96+=z9w;D96+=z1w;editor[D96](conf[h96],generalError);}else {var G96=n9w;G96+=c9w;G96+=P8w;var q96=V5w;q96+=q7n;q96+=H9w;q96+=l9w;if(json[q96]){var m96=c2l;m96+=b5w;m96+=l9w;var L96=c8n;L96+=I0w;$[L96](json[m96],function(table,files){var O96=c2l;E1aa.W2x();O96+=b5w;O96+=l9w;if(!Editor[O96][table]){var x96=V5w;x96+=S5w;Editor[x96][table]={};}$[c3w](Editor[E8w][table],files);});}ids[G96](json[X5b][r5w]);if(counter < files[N8w] - q2l){counter++;reader[G7b](files[counter]);}else {var k96=f0w;k96+=j7b;k96+=Z9w;completeCallback[k96](editor,ids);if(submit){editor[e0n]();}}}progressCallback(conf);},error:function(xhr){var p7b="uploadXhrE";var g96=p7b;g96+=F7b;g96+=z1w;var r96=e4w;r96+=z7b;var d96=M9n;d96+=L0w;d96+=H9w;editor[a2w](conf[d96],generalError);editor[r96](g96,[conf[h6w],xhr]);progressCallback(conf);}}));};files=$[E96](files,function(val){return val;});if(conf[a7b] !== undefined){var V96=M7b;V96+=y9w;V96+=L0w;V96+=U7b;files[i3n](conf[V96],files[N8w]);}reader[G7b](files[h2l]);};Editor[S96][t96]=function(init){var i8b='<div data-dte-e="body" class="';var M8b='<div data-dte-e="form_error" class="';var h8b="taT";var q3b="nTable";var S8b="indic";var P8b="v class=\"";var l8b="Tabl";var p8b="footer";var k8b="<div data-dte-e=\"form";var u7b="Com";var x3b="playController";var T8b="aults";var B8b='<div data-dte-e="body_content" class="';var d8b="_info\" ";var a8b='<div data-dte-e="form_content" class="';var V8b="nte";var v3b="events";var F8b='<form data-dte-e="form" class="';var H8b="rmContent";var R8b="mT";var L8b="<div data-dte-e=\"form_buttons\" ";var n7b="sin";var u8b='"></div></div>';var o8b='"><div class="';var J8b='<div data-dte-e="head" class="';var I8b="legacyAjax";var c7b="Content";var L3b='xhr.dt.dte';var K8b="g\" cl";var x8b="head";var C8b="bT";var G8b="\"></";var W8b="ataTable";var U8b="info";var J7b="initEdito";var O8b="ont";var j8b='<div data-dte-e="foot" class="';var g8b="m>";var W7b="roces";var b8b="domTable";var n8b="BUTTONS";var t8b="<div data-dte-e=\"proces";var h3b='init.dt.dte';var z8b="tag";var N8b="xUr";var o7b="nit";var Z8b="rm_";var D3b='body_content';var f8b="tem";var D8b="ols";E1aa.n2x();var E8b="foo";var j06=J7b;j06+=z9w;var B06=y9w;B06+=o7b;B06+=u7b;B06+=Q7b;var i06=l4b;i06+=B5w;var s06=D4w;s06+=T9w;var T06=D4w;T06+=T9w;var N06=n9w;N06+=W7b;N06+=c1w;var R06=Y7b;R06+=n7b;R06+=K0w;var w06=q4n;w06+=R2w;w06+=c7b;var y06=y5w;y06+=D4w;y06+=E1aa[540234];y06+=x0w;var f06=y5w;f06+=D4w;f06+=E1aa[540234];f06+=x0w;var A06=V5w;A06+=D4w;A06+=D4w;A06+=i9w;var P06=H0w;P06+=Z8b;P06+=f7n;P06+=i9w;var K06=H0w;K06+=H8b;var x06=l8b;x06+=v8b;x06+=D4w;x06+=D8b;var O06=v9w;O06+=h8b;O06+=q8b;O06+=H9w;var m06=L8b;m06+=m8b;var L06=f0w;L06+=O8b;L06+=B5w;var q06=Z4n;q06+=H4n;q06+=z9w;var h06=x8b;h06+=H9w;h06+=z9w;var D06=G8b;D06+=r1b;var v06=V5w;v06+=D4w;v06+=z9w;v06+=L0w;var l06=k8b;l06+=d8b;l06+=m8b;var H06=G8b;H06+=E1aa[540234];H06+=r8b;var Z06=W2w;Z06+=z1w;var c96=V5w;c96+=z1w;c96+=L0w;var n96=A6n;n96+=z0w;n96+=g8b;var Y96=x8w;Y96+=W8w;Y96+=R3w;Y96+=N3w;var W96=f0w;W96+=O8b;W96+=q5w;W96+=i9w;var Q96=E8b;Q96+=i9w;Q96+=H9w;Q96+=z9w;var u96=p3w;u96+=N0w;u96+=L3w;var o96=C1w;o96+=A7n;o96+=p8n;var J96=A6n;J96+=E1aa[540234];J96+=y9w;J96+=N3w;var U96=x8w;U96+=W8w;U96+=R3w;U96+=N3w;var M96=s8n;M96+=V8b;M96+=k0w;var a96=q4n;a96+=R2w;var z96=o1n;z96+=N0w;z96+=p8n;var F96=q4n;F96+=R2w;var p96=S8b;p96+=N0w;p96+=k5w;p96+=z9w;var j96=X8w;j96+=I8w;var B96=t8b;B96+=n7b;B96+=K8b;B96+=Z3w;var i96=x8w;i96+=W8w;var I96=C1w;I96+=A7n;I96+=p8n;var X96=o8w;X96+=w1w;X96+=P8b;var e96=E1aa[540234];e96+=U8w;var b96=y9w;b96+=Y3w;b96+=n3w;b96+=T9w;var s96=S9w;s96+=A8b;s96+=Z9w;s96+=V8n;var T96=f8b;T96+=n9w;T96+=y8b;var C96=Q0b;C96+=W0b;var N96=E1aa[540234];N96+=N0w;N96+=t0n;N96+=w8b;var R96=i9w;R96+=N0w;R96+=y5w;R96+=b5w;var w96=E1aa[540234];w96+=D4w;w96+=R8b;w96+=s2w;var y96=p3n;y96+=N0w;y96+=N8b;y96+=Z9w;var f96=E1aa[540234];f96+=C8b;f96+=q8b;f96+=H9w;var A96=L0w;A96+=Q6n;A96+=t1w;A96+=l9w;var P96=z2n;P96+=m0b;var K96=h9w;K96+=V5w;K96+=T8b;init=$[c3w](s8w,{},Editor[K96],init);this[l9w]=$[P96](s8w,{},Editor[A96][O1n],{actionName:init[s8b],table:init[b8b] || init[i0n],dbTable:init[f96] || p6w,ajaxUrl:init[y96],ajax:init[a5b],idSrc:init[e8b],dataSource:init[w96] || init[R96]?Editor[X8b][N96]:Editor[X8b][P9n],formOptions:init[C96],legacyAjax:init[I8b],template:init[T96]?$(init[s96])[e5n]():p6w});this[i2w]=$[c3w](s8w,{},Editor[i2w]);this[W0n]=init[b96];Editor[L1n][O1n][E0b]++;var that=this;var classes=this[i2w];this[e96]={"wrapper":$(X96 + classes[I96] + i96 + B96 + classes[j96][p96] + i6w + i8b + classes[F96][z96] + K6w + B8b + classes[a96][M96] + U96 + J96 + j8b + classes[p8b][o96] + K6w + u96 + classes[Q96][W96] + Y96 + T6w + T6w)[h2l],"form":$(F8b + classes[c6n][z8b] + K6w + a8b + classes[c6n][j1n] + R6w + n96)[h2l],"formError":$(M8b + classes[c96][Z06] + H06)[h2l],"formInfo":$(l06 + classes[v06][U8b] + D06)[h2l],"header":$(J8b + classes[h06][q06] + o8b + classes[q3n][L06] + u8b)[h2l],"buttons":$(m06 + classes[c6n][T2n] + R6w)[h2l]};if($[k9n][O06][x06]){var k06=Q8b;k06+=H9w;var G06=E1aa[540234];G06+=W8b;var ttButtons=$[k9n][G06][Y8b][n8b];var i18n=this[W0n];$[z9n]([k06,V5b,t5b],function(i,val){var Z3b="B";var H3b="uttonTex";var g06=y5w;g06+=c9w;g06+=c8b;g06+=T0w;var r06=l9w;r06+=Z3b;E1aa.n2x();r06+=H3b;r06+=i9w;var d06=B0w;d06+=l3b;d06+=z9w;d06+=e4w;ttButtons[d06 + val][r06]=i18n[val][g06];});}$[z9n](init[v3b],function(evt,fn){var E06=D4w;E06+=T9w;that[E06](evt,function(){var t06=S9n;t06+=n9w;t06+=Z9w;t06+=x0w;var S06=l9w;S06+=s1w;S06+=G2w;var V06=D5w;V06+=N4w;var args=Array[V06][S06][c2n](arguments);args[h1n]();fn[t06](that,args);});});var dom=this[Q6w];var wrapper=dom[h4n];dom[K06]=_editor_el(P06,dom[c6n])[h2l];dom[p8b]=_editor_el(A06,wrapper)[h2l];dom[f06]=_editor_el(y06,wrapper)[h2l];dom[w06]=_editor_el(D3b,wrapper)[h2l];dom[R06]=_editor_el(N06,wrapper)[h2l];if(init[y3n]){var C06=t5w;C06+=E1aa[540234];C06+=l9w;this[K3n](init[C06]);}$(document)[T06](h3b + this[l9w][E0b],function(e,settings,json){E1aa.n2x();if(that[l9w][i0n] && settings[q3b] === $(that[l9w][i0n])[P0n](h2l)){settings[Z5b]=that;}})[s06](L3b + this[l9w][E0b],function(e,settings,json){var m3b="_optionsUpdate";var e06=K0w;e06+=H9w;e06+=i9w;var b06=i9w;b06+=q8b;b06+=H9w;if(json && that[l9w][b06] && settings[q3b] === $(that[l9w][i0n])[e06](h2l)){that[m3b](json);}});try{var I06=w1w;I06+=O3b;I06+=y0w;I06+=x0w;var X06=N5w;X06+=x3b;this[l9w][X06]=Editor[I06][init[G9n]][E3n](this);}catch(e){var G3b='Cannot find display controller ';throw G3b + init[G9n];}this[i06](B06,[]);$(document)[k3b](j06,[this]);};Editor[k2w][p06]=function(){var E3b="actions";var r3b="actio";var V3b="ddC";var g3b="asses";var Q06=g4b;Q06+=i9w;var o06=C8w;o06+=D4w;o06+=t0w;var J06=H9w;J06+=E1aa[540234];J06+=y9w;J06+=i9w;var U06=f0w;U06+=z9w;U06+=d3b;var M06=o1n;M06+=S9n;M06+=G7n;var a06=q7w;a06+=L0w;var z06=r3b;z06+=T9w;var F06=i4n;F06+=g3b;var classesActions=this[F06][E3b];var action=this[l9w][z06];var wrapper=$(this[a06][M06]);wrapper[N2n]([classesActions[U06],classesActions[J06],classesActions[f0n]][o06](E6w));if(action === x9b){var u06=N0w;u06+=V3b;u06+=B2w;wrapper[u06](classesActions[x9b]);}else if(action === Q06){var W06=N0w;W06+=g6n;W06+=S3b;wrapper[W06](classesActions[x6w]);}else if(action === f0n){var n06=t3b;n06+=K3b;var Y06=N0w;Y06+=P3b;wrapper[Y06](classesActions[n06]);}};Editor[k2w][A3b]=function(data,success,error,submitParams){var z3b=',';var n3b="unsh";var Y3b="complete";var W3b="comple";var b3b="Ur";var c3b="ift";var Q3b="mplet";var o3b=/_id_/;var R3b="nObjec";var M3b="eplace";var y3b="nc";var l6b="param";var a3b="Url";var Z6b='DELETE';var H6b="deleteBody";var s3b="ditFields";var w3b="sPlai";var v6b='?';var s16=v9w;s16+=i9w;s16+=N0w;var N16=c9w;N16+=z9w;N16+=Z9w;var r16=f3b;r16+=y3b;r16+=Z7w;var d16=y9w;d16+=w3b;d16+=R3b;d16+=i9w;var k16=y9w;k16+=l9w;k16+=N3b;k16+=C3b;var G16=y9w;G16+=T3b;G16+=z9w;G16+=f0w;var x16=H9w;x16+=s3b;var O16=t3b;O16+=D4w;E1aa.n2x();O16+=a5n;var m16=H9w;m16+=E1aa[540234];m16+=y9w;m16+=i9w;var L16=u5w;L16+=e1w;L16+=b3b;L16+=Z9w;var q16=N0w;q16+=C8w;q16+=N0w;q16+=e1w;var Z16=C8w;Z16+=l9w;Z16+=D4w;Z16+=T9w;var c06=N0w;c06+=C0w;c06+=C1n;var that=this;var action=this[l9w][c06];var thrown;var opts={type:F9b,dataType:Z16,data:p6w,error:[function(xhr,text,err){thrown=err;}],success:[],complete:[function(xhr,text){var B3b="eJSON";var p3b="tatus";var i2l=204;var X3b="tu";var j3b="responseJSON";var I3b="responseText";var D16=q0b;D16+=e3b;D16+=C0w;var l16=t9b;l16+=Z9w;l16+=Z9w;var H16=x9n;H16+=N0w;H16+=X3b;E1aa.W2x();H16+=l9w;var json=p6w;if(xhr[H16] === i2l || xhr[I3b] === l16){json={};}else {try{var v16=i3b;v16+=l9w;v16+=B3b;json=xhr[j3b]?xhr[j3b]:$[v16](xhr[I3b]);}catch(e){}}if($[D16](json) || Array[r0n](json)){var h16=l9w;h16+=p3b;success(json,xhr[h16] >= B2l,xhr);}else {error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[l9w][q16] || this[l9w][L16];var id=action === m16 || action === O16?_pluck(this[l9w][x16],G16):p6w;if(Array[k16](id)){id=id[F3b](z3b);}if($[d16](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === r16){var g16=p3n;g16+=N0w;g16+=e1w;g16+=a3b;var uri=p6w;var method=p6w;if(this[l9w][g16]){var S16=z9w;S16+=M3b;var V16=f0w;V16+=z9w;V16+=d3b;var E16=N0w;E16+=h7b;E16+=a3b;var url=this[l9w][E16];if(url[V16]){uri=url[action];}if(uri[U3b](E6w) !== -q2l){a=uri[J3b](E6w);method=a[h2l];uri=a[q2l];}uri=uri[S16](o3b,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc === o2n){if(ajaxSrc[U3b](E6w) !== -q2l){var t16=c9w;t16+=z9w;t16+=Z9w;a=ajaxSrc[J3b](E6w);opts[N4w]=a[h2l];opts[t16]=a[q2l];}else {var K16=c9w;K16+=z9w;K16+=Z9w;opts[K16]=ajaxSrc;}}else {var R16=H9w;R16+=u3b;var A16=f0w;A16+=D4w;A16+=Q3b;A16+=H9w;var P16=H9w;P16+=V4b;P16+=q5w;P16+=E1aa[540234];var optsCopy=$[P16]({},ajaxSrc || ({}));if(optsCopy[A16]){var f16=W3b;f16+=i9w;f16+=H9w;opts[Y3b][d2w](optsCopy[f16]);delete optsCopy[Y3b];}if(optsCopy[a2w]){var w16=H1w;w16+=H4w;w16+=z9w;var y16=n3b;y16+=c3b;opts[a2w][y16](optsCopy[a2w]);delete optsCopy[w16];}opts=$[R16]({},opts,optsCopy);}opts[N16]=opts[O0b][L0n](o3b,id);if(opts[m6w]){var T16=H9w;T16+=e1w;T16+=J4b;T16+=E1aa[540234];var C16=m2w;C16+=f0w;C16+=Z7w;var isFn=typeof opts[m6w] === C16;var newData=isFn?opts[m6w](data):opts[m6w];data=isFn && newData?newData:$[T16](s8w,data,newData);}opts[s16]=data;if(opts[N4w] === Z6b && (opts[H6b] === undefined || opts[H6b] === s8w)){var X16=E1aa[540234];X16+=M3w;var e16=c9w;e16+=z9w;e16+=Z9w;var b16=G6w;b16+=N0w;var params=$[l6b](opts[b16]);opts[O0b]+=opts[e16][U3b](v6b) === -q2l?v6b + params:O0n + params;delete opts[X16];}$[a5b](opts);};Editor[k2w][T4n]=function(target,style,time,callback){var D6b="stop";var I16=V5w;I16+=T9w;if($[I16][p0n]){target[D6b]()[p0n](style,time,callback);}else {var i16=m2w;i16+=O2w;target[M6w](style);if(typeof time === i16){var B16=h6b;B16+=Z9w;B16+=Z9w;time[B16](target);}else if(callback){var j16=f0w;j16+=N0w;j16+=q6b;callback[j16](target);}}};Editor[p16][f0b]=function(){var L6b="rmI";var m6b="bodyCont";var O6b="mE";var G6b="prep";var W16=N0w;W16+=n9w;W16+=r9w;W16+=o5w;var Q16=V5w;Q16+=D4w;Q16+=L6b;Q16+=d3w;var u16=N0w;u16+=H4n;u16+=T9w;u16+=E1aa[540234];var o16=m6b;o16+=H9w;o16+=T9w;o16+=i9w;var J16=z0w;E1aa.W2x();J16+=O6b;J16+=G5w;J16+=z9w;var U16=N0w;U16+=x6b;U16+=q5w;U16+=E1aa[540234];var M16=H0w;M16+=l5w;M16+=H9w;M16+=z9w;var a16=G6b;a16+=H9w;a16+=o5w;var z16=G5n;z16+=n9w;z16+=H1w;var F16=E1aa[540234];F16+=D4w;F16+=L0w;var dom=this[F16];$(dom[z16])[a16](dom[q3n]);$(dom[M16])[U16](dom[J16])[F1n](dom[T2n]);$(dom[o16])[u16](dom[Q16])[W16](dom[c6n]);};Editor[k2w][k6b]=function(){var g6b="onBlur";var d6b="ncti";var r6b="preBlu";var E6b="bm";var Z46=f0w;Z46+=b1n;var n16=V5w;n16+=c9w;E1aa.W2x();n16+=d6b;n16+=T0w;var Y16=r6b;Y16+=z9w;var opts=this[l9w][z3n];var onBlur=opts[g6b];if(this[G4b](Y16) === R8w){return;}if(typeof onBlur === n16){onBlur(this);}else if(onBlur === U3n){var c16=Z5w;c16+=E6b;c16+=y9w;c16+=i9w;this[c16]();}else if(onBlur === Z46){this[q2n]();}};Editor[H46][l46]=function(errorsOnly){var q46=e2w;q46+=X2w;var h46=E1aa[540234];h46+=D4w;h46+=L0w;var D46=W2w;D46+=z1w;var v46=V5w;v46+=g3n;E1aa.n2x();v46+=Z9w;v46+=E1aa[540234];if(!this[l9w]){return;}var errorClass=this[i2w][v46][D46];var fields=this[l9w][y3n];if(errorsOnly === undefined){errorsOnly=R8w;}$(e1b + errorClass,this[h46][h4n])[q46](errorClass);$[z9n](fields,function(name,field){var V6b="ssa";E1aa.W2x();var L46=W2w;L46+=z1w;field[L46](H8w);if(!errorsOnly){var m46=L0w;m46+=H9w;m46+=V6b;m46+=E5w;field[m46](H8w);}});this[a2w](H8w);if(!errorsOnly){this[l3w](H8w);}};Editor[k2w][O46]=function(submitComplete,mode){var t6b="focus.editor-";var f6b="closeCb";var w6b="Icb";var A6b="closeC";var K6b="oseCb";E1aa.n2x();var R6b="eIc";var P6b='preClose';var S46=w1w;S46+=S6b;S46+=E9n;S46+=B0w;var V46=t6b;V46+=D2w;var E46=t5n;E46+=V5w;var g46=y5w;g46+=D4w;g46+=E1aa[540234];g46+=x0w;var G46=i4n;G46+=K6b;var x46=e4w;x46+=H9w;x46+=a5n;x46+=k0w;var closed;if(this[x46](P6b) === R8w){return;}if(this[l9w][G46]){var k46=A6b;k46+=y5w;closed=this[l9w][f6b](submitComplete,mode);this[l9w][k46]=p6w;}if(this[l9w][y6b]){var r46=X4n;r46+=w6b;var d46=f0w;d46+=Y5w;d46+=R6b;d46+=y5w;this[l9w][d46]();this[l9w][r46]=p6w;}$(g46)[E46](V46);this[l9w][S46]=R8w;this[G4b](k1n);if(closed){this[G4b](k4b,[closed]);}};Editor[t46][K46]=function(fn){var N6b="seCb";var P46=f0w;P46+=y5n;P46+=N6b;this[l9w][P46]=fn;};Editor[A46][f46]=function(arg1,arg2,arg3,arg4){var T6b='boolean';var C6b="rmOptions";var s6b="main";var R46=V5w;R46+=D4w;R46+=C6b;var w46=H9w;w46+=u3b;var that=this;var title;var buttons;var show;var opts;if($[l6n](arg1)){opts=arg1;}else if(typeof arg1 === T6b){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=s8w;}if(title){that[N6w](title);}if(buttons){var y46=y5w;y46+=E6n;y46+=l9w;that[y46](buttons);}E1aa.W2x();return {opts:$[w46]({},this[l9w][R46][s6b],opts),maybeOpen:function(){if(show){var N46=D4w;N46+=t9n;that[N46]();}}};};Editor[C46][D6n]=function(name){var b6b="dataSource";var s46=l9w;s46+=d5w;s46+=y9w;s46+=E2n;var T46=k4w;T46+=A5w;T46+=p4w;T46+=H9w;var args=Array[T46][D1n][c2n](arguments);args[s46]();var fn=this[l9w][b6b][name];if(fn){return fn[q1n](this,args);}};Editor[b46][e46]=function(includeFields){var X6b="formContent";var e6b="isplayOrder";var I6b="cludeFields";var z6b="endTo";var J46=E1aa[540234];J46+=e6b;var p46=E1aa[540234];p46+=H9w;p46+=B1b;p46+=d5w;var j46=I0w;j46+=t6n;var i46=L0w;i46+=C2w;var I46=h7w;I46+=h9w;var X46=S9w;X46+=L0w;X46+=n9w;X46+=y8b;var that=this;var formContent=$(this[Q6w][X6b]);var fields=this[l9w][y3n];var order=this[l9w][e3n];var template=this[l9w][X46];var mode=this[l9w][I46] || i46;if(includeFields){var B46=t0w;B46+=I6b;this[l9w][B46]=includeFields;}else {includeFields=this[l9w][q9b];}formContent[j46]()[p46]();$[z9n](order,function(i,fieldOrName){var j6b='editor-field[name="';var i6b="_weakInArray";var F6b='[data-editor-template="';E1aa.W2x();var p6b="after";var F46=T9w;F46+=N0w;F46+=L0w;F46+=H9w;var name=fieldOrName instanceof Editor[p9w]?fieldOrName[F46]():fieldOrName;if(that[i6b](name,includeFields) !== -q2l){var z46=L0w;z46+=N0w;z46+=t0w;if(template && mode === z46){var M46=T9w;M46+=D4w;M46+=E1aa[540234];M46+=H9w;var a46=x8w;a46+=B6b;template[v0b](j6b + name + a46)[p6b](fields[name][M46]());template[v0b](F6b + name + G8w)[F1n](fields[name][x3n]());}else {formContent[F1n](fields[name][x3n]());}}});if(template && mode === d4b){var U46=u1n;U46+=z6b;template[U46](formContent);}this[G4b](J46,[this[l9w][S0b],this[l9w][D3n],formContent]);};Editor[k2w][A0b]=function(items,editFields,type,formOptions,setupDone){var M6b="tEdit";var H2b="toStr";var U6b="ctionCl";var a6b="ini";var v2b="lice";var k56=E1aa[540234];k56+=N0w;k56+=t0n;var G56=T9w;G56+=Q6n;G56+=H9w;var x56=a6b;x56+=M6b;var Y46=t4n;Y46+=U6b;Y46+=J6b;var W46=l9w;W46+=i9w;W46+=x0w;W46+=b5w;var Q46=q7w;Q46+=L0w;var u46=H9w;u46+=w1w;u46+=i9w;var o46=c2l;o46+=g4w;o46+=l9w;var that=this;var fields=this[l9w][o46];var usedFields=[];var includeInOrder;var editData={};this[l9w][T3n]=editFields;this[l9w][o6b]=editData;this[l9w][W1b]=items;this[l9w][D3n]=u46;this[Q46][c6n][W46][G9n]=Q9n;this[l9w][e0w]=type;this[Y46]();$[z9n](fields,function(name,field){var u6b="Reset";var h56=T9n;h56+=i9w;h56+=d5w;var c46=H9w;c46+=i4b;var n46=W6w;n46+=u6b;field[n46]();includeInOrder=R8w;editData[name]={};$[c46](editFields,function(idSrc,edit){var n6b="displayF";var Y6b="scope";var c6b="ult";if(edit[y3n][name]){var Z56=Q6b;Z56+=z9w;Z56+=z9w;Z56+=E9n;var val=field[W6b](edit[m6w]);editData[name][idSrc]=val === p6w?H8w:Array[Z56](val)?val[D1n]():val;if(!formOptions || formOptions[Y6b] === g1n){var v56=n6b;v56+=g3n;v56+=A9b;var l56=E1aa[540234];l56+=H9w;l56+=V5w;var H56=L0w;H56+=c6b;H56+=y9w;H56+=O5w;field[H56](idSrc,val !== undefined?val:field[l56]());if(!edit[v56] || edit[v1b][name]){includeInOrder=s8w;}}else {if(!edit[v1b] || edit[v1b][name]){var D56=E1aa[540234];D56+=H9w;D56+=V5w;field[b3n](idSrc,val !== undefined?val:field[D56]());includeInOrder=s8w;}}}});if(field[Q2w]()[h56] !== h2l && includeInOrder){var q56=n9w;q56+=Z2b;usedFields[q56](name);}});var currOrder=this[e3n]()[D1n]();for(var i=currOrder[N8w] - q2l;i >= h2l;i--){var m56=H2b;m56+=y9w;m56+=T9w;m56+=K0w;var L56=l2b;L56+=F7b;L56+=E9n;if($[L56](currOrder[i][m56](),usedFields) === -q2l){var O56=O3b;O56+=v2b;currOrder[O56](i,q2l);}}this[w9b](currOrder);this[G4b](x56,[_pluck(editFields,G56)[h2l],_pluck(editFields,k56)[h2l],items,type],function(){var D2b="initMult";var h2b="iEdit";var r56=D2b;r56+=h2b;var d56=v2n;d56+=q2b;that[d56](r56,[editFields,items,type],function(){E1aa.W2x();setupDone();});});};Editor[k2w][G4b]=function(trigger,args,promiseComplete){var L2b="sArray";var r2b="result";var k2b="lle";E1aa.W2x();var g2b="resu";var G2b="Cance";var x2b='pre';var d2b="iggerHandler";var m2b="Event";var g56=y9w;g56+=L2b;if(!args){args=[];}if(Array[g56](trigger)){var E56=Z9w;E56+=q5w;E56+=K0w;E56+=Y7n;for(var i=h2l,ien=trigger[E56];i < ien;i++){var V56=l4b;V56+=H9w;V56+=k0w;this[V56](trigger[i],args);}}else {var S56=z9w;S56+=H9w;S56+=Z5w;S56+=V2w;var e=$[m2b](trigger);$(this)[O2b](e,args);if(trigger[U3b](x2b) === h2l && e[S56] === R8w){var K56=G2b;K56+=k2b;K56+=E1aa[540234];var t56=e5w;t56+=d2b;$(this)[t56]($[m2b](trigger + K56),args);}if(promiseComplete){var P56=z9w;P56+=R0w;P56+=c9w;P56+=V2w;if(e[r2b] && typeof e[P56] === E1aa[186121] && e[r2b][h0b]){var A56=g2b;A56+=Z9w;A56+=i9w;e[A56][h0b](promiseComplete);}else {promiseComplete(e[r2b]);}}return e[r2b];}};Editor[k2w][f56]=function(input){var P2b="Case";var K2b="toLow";var V2b=/^on([A-Z])/;var t2b="ri";var S2b="subs";var N56=C8w;N56+=D4w;N56+=y9w;N56+=T9w;var y56=b5w;y56+=T9w;y56+=F0n;y56+=d5w;var name;var names=input[J3b](E6w);for(var i=h2l,ien=names[y56];i < ien;i++){name=names[i];var onStyle=name[E2b](V2b);if(onStyle){var R56=S2b;R56+=i9w;R56+=t2b;R56+=X9b;var w56=K2b;w56+=H1w;w56+=P2b;name=onStyle[q2l][w56]() + name[R56](m2l);}names[i]=name;}return names[N56](E6w);};Editor[k2w][A2b]=function(node){var foundField=p6w;$[z9n](this[l9w][y3n],function(name,field){var f2b="nod";var s56=T9n;s56+=Y7n;var T56=V5w;T56+=y9w;E1aa.W2x();T56+=T9w;T56+=E1aa[540234];var C56=f2b;C56+=H9w;if($(field[C56]())[T56](node)[s56]){foundField=field;}});return foundField;};Editor[k2w][b56]=function(fieldNames){var y2b="sA";var X56=y9w;X56+=y2b;X56+=z9w;X56+=C3b;if(fieldNames === undefined){var e56=t5w;e56+=K5w;return this[e56]();}else if(!Array[X56](fieldNames)){return [fieldNames];}return fieldNames;};Editor[I56][i56]=function(fieldsIn,focus){var T2b="O";var I2b="foc";var e2b="lu";var s2b="TE ";var N2b="q:";var w2b="Foc";var R2b='number';var C2b="inde";var b2b=/^jq:/;var a56=y4w;E1aa.n2x();a56+=i9w;a56+=w2b;a56+=W5w;var that=this;var field;var fields=$[t0b](fieldsIn,function(fieldOrName){E1aa.n2x();return typeof fieldOrName === o2n?that[l9w][y3n][fieldOrName]:fieldOrName;});if(typeof focus === R2b){field=fields[focus];}else if(focus){var j56=C8w;j56+=N2b;var B56=C2b;B56+=e1w;B56+=T2b;B56+=V5w;if(focus[B56](j56) === h2l){var p56=l5n;p56+=m9w;p56+=s2b;field=$(p56 + focus[L0n](b2b,H8w));}else {var F56=c2l;F56+=i0b;field=this[l9w][F56][focus];}}else {var z56=y5w;z56+=e2b;z56+=z9w;document[X2b][z56]();}this[l9w][a56]=field;if(field){var M56=I2b;M56+=W5w;field[M56]();}};Editor[k2w][b9b]=function(opts){var W2b="OnBl";var H9j="eturn";var i2b="eyd";var m9j="utt";var p2b="itl";var u2b="submitOnBlur";var l9j="onBac";var c2b="submitOnRetur";var g9j='keyup';var v9j="kgro";var d9j="canReturnSubmit";var j2b="tons";var Y2b="ur";var M2b="turn";var Z9j="onR";var n2b="onBlu";var D9j="blurOnBackground";var B2b="wn";var z2b="submitO";var U2b='.dteInline';var F2b="lurOnBackgr";var a2b="nR";var J2b="closeOnComplete";var S76=D4w;S76+=T9w;var d76=V7w;d76+=i2b;d76+=D4w;d76+=B2b;var k76=D4w;k76+=T9w;var x76=c3n;x76+=Z6n;x76+=T9w;var O76=y5w;O76+=W8n;O76+=j2b;var v76=g2w;v76+=i9w;v76+=C1n;var l76=l9w;l76+=Q5b;var H76=i9w;H76+=p2b;H76+=H9w;var Y56=y5w;Y56+=F2b;Y56+=E7n;var u56=z2b;u56+=a2b;u56+=H9w;u56+=M2b;var that=this;var inlineCount=__inlineCounter++;var namespace=U2b + inlineCount;if(opts[J2b] !== undefined){opts[o2b]=opts[J2b]?k1n:V9n;}if(opts[u2b] !== undefined){var o56=l9w;o56+=n5w;var J56=Q2b;J56+=F7n;J56+=W2b;J56+=Y2b;var U56=n2b;U56+=z9w;opts[U56]=opts[J56]?o56:k1n;}if(opts[u56] !== undefined){var W56=c2b;W56+=T9w;var Q56=Z9j;Q56+=H9j;opts[Q56]=opts[W56]?U3n:V9n;}if(opts[Y56] !== undefined){var Z76=T9w;Z76+=D4w;Z76+=w9w;var c56=y5w;c56+=Z9w;c56+=c9w;c56+=z9w;var n56=l9j;n56+=v9j;n56+=a4n;opts[n56]=opts[D9j]?c56:Z76;}this[l9w][z3n]=opts;this[l9w][h9j]=inlineCount;if(typeof opts[H76] === l76 || typeof opts[N6w] === v76){var h76=i9w;h76+=q9j;var D76=i9w;D76+=F7n;D76+=Z9w;D76+=H9w;this[D76](opts[N6w]);opts[h76]=s8w;}if(typeof opts[l3w] === o2n || typeof opts[l3w] === E1aa[363362]){var m76=U1b;m76+=K0w;m76+=H9w;var L76=L5b;L76+=L9j;L76+=E5w;var q76=x9w;q76+=w0w;q76+=k5b;this[q76](opts[L76]);opts[m76]=s8w;}if(typeof opts[O76] !== x76){var G76=y5w;G76+=m9j;G76+=G1b;this[T2n](opts[T2n]);opts[G76]=s8w;}$(document)[k76](d76 + namespace,function(e){var G9j="_fieldFro";var k9j="mN";var x9j="yCod";var r9j="reventD";var g76=w1w;g76+=O9j;var r76=W2n;r76+=x9j;r76+=H9w;if(e[r76] === E2l && that[l9w][g76]){var el=$(document[X2b]);if(el){var E76=G9j;E76+=k9j;E76+=Q6n;E76+=H9w;var field=that[E76](el);if(field && typeof field[d9j] === E1aa[363362] && field[d9j](el)){var V76=n9w;V76+=r9j;V76+=q9n;V76+=S2w;e[V76]();}}}});$(document)[S76](g9j + namespace,function(e){var s9j="Default";var j9j='.DTE_Form_Buttons';var N9j="ntDefaul";var e9j="nE";var X9j="ven";var P9j="unc";var A9j="nRetu";var b9j="onEs";var R9j="pre";var M9j='button';var I9j="tDe";var w9j="tur";var C9j="urn";var y9j="nRe";var p9j="key";var C2l=37;var z9j="ocu";var T2l=39;var K9j="nReturnSubmit";var S9j="ayed";var B9j="onEsc";var F9j="Code";var f9j="rn";var E9j="ngt";var i9j="fault";var T9j="prevent";var p76=Z9w;p76+=H9w;p76+=E9j;p76+=d5w;var T76=W2n;T76+=x0w;T76+=V9j;T76+=n2n;var t76=E1aa[540234];t76+=y9w;t76+=S6b;t76+=S9j;var el=$(document[X2b]);if(e[t9j] === E2l && that[l9w][t76]){var P76=h6b;P76+=K9j;var K76=V5w;K76+=P9j;K76+=Z7w;var field=that[A2b](el);if(field && typeof field[d9j] === K76 && field[P76](el)){var R76=m2w;R76+=C0w;R76+=C1n;var w76=D4w;w76+=A9j;w76+=f9j;var A76=D4w;A76+=y9j;A76+=w9j;A76+=T9w;if(opts[A76] === U3n){var y76=Q2b;y76+=y9w;y76+=i9w;var f76=R9j;f76+=a5n;f76+=N9j;f76+=i9w;e[f76]();that[y76]();}else if(typeof opts[w76] === R76){var C76=D4w;C76+=a2b;C76+=K9n;C76+=C9j;var N76=T9j;N76+=s9j;e[N76]();opts[C76](that,e);}}}else if(e[T76] === f2l){var B76=l9w;B76+=c9w;B76+=H5w;B76+=i9w;var I76=f0w;I76+=Z9w;I76+=S4n;var X76=b9j;X76+=f0w;var e76=D4w;e76+=e9j;e76+=l9w;e76+=f0w;var b76=D4w;b76+=e9j;b76+=l9w;b76+=f0w;var s76=R9j;s76+=X9j;s76+=I9j;s76+=i9j;e[s76]();if(typeof opts[b76] === E1aa[363362]){opts[B9j](that,e);}else if(opts[e76] === d1n){that[M3n]();}else if(opts[X76] === I76){var i76=z7n;i76+=H9w;that[i76]();}else if(opts[B9j] === B76){var j76=Q2b;j76+=y9w;j76+=i9w;that[j76]();}}else if(el[T2w](j9j)[p76]){var a76=p9j;a76+=F9j;var F76=p9j;F76+=V9j;F76+=n2n;if(e[F76] === C2l){var z76=V5w;z76+=z9j;z76+=l9w;el[a9j](M9j)[z76]();}else if(e[a76] === T2l){var J76=V5w;J76+=v9n;J76+=W5w;var U76=F5w;U76+=i9w;U76+=k5w;U76+=T9w;var M76=T9w;M76+=A1n;el[M76](U76)[J76]();}}});this[l9w][y6b]=function(){E1aa.W2x();var o76=D4w;o76+=V5w;o76+=V5w;$(document)[I5n](U9j + namespace);$(document)[o76](g9j + namespace);};return namespace;};Editor[k2w][u76]=function(direction,action,data){var J9j="legacy";var Q76=J9j;Q76+=O4w;Q76+=e1w;if(!this[l9w][Q76] || !data){return;}if(direction === o9j){var W76=Q8b;W76+=H9w;if(action === W76 || action === V5b){var n76=H9w;n76+=E1aa[540234];n76+=y9w;n76+=i9w;var id;$[z9n](data[m6w],function(rowId,values){var u9j="Editor: Mu";var Y9j=" not supported by the legacy Ajax data format";var W9j=" editing is";var Q9j="lti-row";if(id !== undefined){var Y76=u9j;Y76+=Q9j;Y76+=W9j;Y76+=Y9j;throw Y76;}id=rowId;});data[m6w]=data[m6w][id];if(action === n76){data[r5w]=id;}}else {var Z86=v9w;Z86+=t0n;var c76=N9b;c76+=n9w;data[r5w]=$[c76](data[Z86],function(values,id){E1aa.n2x();return id;});delete data[m6w];}}else {var l86=z9w;l86+=D4w;l86+=C1w;var H86=E1aa[540234];H86+=M3w;if(!data[H86] && data[l86]){var v86=v9w;v86+=t0n;data[v86]=[data[O3n]];}else if(!data[m6w]){data[m6w]=[];}}};Editor[k2w][D86]=function(json){var n9j="io";var h86=h5w;h86+=i9w;h86+=n9j;h86+=a6n;var that=this;if(json[h86]){$[z9n](this[l9w][y3n],function(name,field){var Z0j="update";if(json[c9j][name] !== undefined){var fieldInst=that[r3n](name);if(fieldInst && fieldInst[Z0j]){var q86=D4w;q86+=l2w;q86+=n9j;q86+=a6n;fieldInst[Z0j](json[q86][name]);}}});}};Editor[L86][H0j]=function(el,msg,title,fn){var L0j="blo";var l0j="fadeOu";var q0j="fadeI";var h0j='title';var D0j="removeAttr";var canAnimate=$[k9n][p0n]?s8w:R8w;if(title === undefined){title=R8w;}if(!fn){fn=function(){};}if(typeof msg === E1aa[363362]){msg=msg(this,new DataTable[J3w](this[l9w][i0n]));}el=$(el);if(canAnimate){var m86=l9w;m86+=i9w;m86+=D4w;m86+=n9w;el[m86]();}if(!msg){if(this[l9w][S0b] && canAnimate){var O86=l0j;O86+=i9w;el[O86](function(){el[P9n](H8w);fn();});}else {var x86=d5w;x86+=v0j;el[x86](H8w)[M6w](u9n,V9n);fn();}if(title){el[D0j](h0j);}}else {fn();if(this[l9w][S0b] && canAnimate){var G86=q0j;G86+=T9w;el[P9n](msg)[G86]();}else {var k86=L0j;k86+=d6n;el[P9n](msg)[M6w](u9n,k86);}if(title){var d86=i9w;d86+=y9w;d86+=D5b;d86+=H9w;el[b5b](d86,msg);}}};Editor[r86][g86]=function(){var m0j="multiInfoShown";var V86=b5w;V86+=X9b;V86+=Y7n;var E86=r3n;E86+=l9w;E1aa.n2x();var fields=this[l9w][E86];var include=this[l9w][q9b];var show=s8w;var state;if(!include){return;}for(var i=h2l,ien=include[V86];i < ien;i++){var field=fields[include[i]];var multiEditable=field[v2w]();if(field[L9n]() && multiEditable && show){state=s8w;show=R8w;}else if(field[L9n]() && !multiEditable){state=s8w;}else {state=R8w;}fields[include[i]][m0j](state);}};Editor[S86][m2n]=function(type,immediate){var y0j='opened';var r0j='submit.editor-internal';var d0j="captureFocus";var G0j="splayCon";var k0j="roller";var x0j="editor-internal";var O0j="t.";var E0j='focus.editor-focus';var b86=D4w;b86+=n9w;b86+=H9w;b86+=T9w;var s86=l4b;s86+=B5w;var A86=F5w;A86+=y5w;A86+=a5w;A86+=H9w;var P86=Z5w;P86+=H5w;P86+=O0j;P86+=x0j;var K86=D4w;K86+=T9w;var t86=w1w;t86+=G0j;t86+=i9w;t86+=k0j;var that=this;var focusCapture=this[l9w][t86][d0j];if(focusCapture === undefined){focusCapture=s8w;}$(this[Q6w][c6n])[I5n](r0j)[K86](P86,function(e){e[g0j]();});if(focusCapture && (type === d4b || type === A86)){var f86=D4w;f86+=T9w;$(A4n)[f86](E0j,function(){var V0j="ED";var P0j="emen";var S0j=".D";var f0j="Focus";var A0j="setFocus";var K0j="activeEl";var C86=Z9w;C86+=q5w;C86+=F0n;C86+=d5w;var N86=k1b;N86+=m9w;N86+=o0w;N86+=V0j;var R86=S0j;R86+=o0w;R86+=d0w;var w86=i3b;w86+=H9w;w86+=t0j;var y86=K0j;y86+=P0j;y86+=i9w;if($(document[y86])[w86](R86)[N8w] === h2l && $(document[X2b])[T2w](N86)[C86] === h2l){if(that[l9w][A0j]){var T86=y4w;T86+=i9w;T86+=f0j;that[l9w][T86][D2w]();}}});}this[Z1n]();this[s86](b86,[type,this[l9w][D3n]]);if(immediate){this[G4b](y0j,[type,this[l9w][D3n]]);}return s8w;};Editor[k2w][w1b]=function(type){E1aa.W2x();var T0j="bubb";var w0j="_clearDyn";var s0j='cancelOpen';var R0j="micI";var C0j="seIcb";var j86=w1w;j86+=O9j;var B86=w0j;B86+=N0w;B86+=R0j;B86+=d3w;var e86=l4b;e86+=H9w;e86+=T9w;e86+=i9w;if(this[e86](N0j,[type,this[l9w][D3n]]) === R8w){var i86=f0w;i86+=Z9w;i86+=D4w;i86+=C0j;var I86=T0j;I86+=Z9w;I86+=H9w;var X86=L0w;X86+=D4w;X86+=E1aa[540234];X86+=H9w;this[h2n]();this[G4b](s0j,[type,this[l9w][D3n]]);if((this[l9w][e0w] === P5b || this[l9w][X86] === I86) && this[l9w][i86]){this[l9w][y6b]();}this[l9w][y6b]=p6w;return R8w;}this[B86](s8w);this[l9w][j86]=type;return s8w;};Editor[p86][F86]=function(processing){var X0j='processing';var e0j='div.DTE';var U86=e4w;U86+=z7b;var M86=j3w;M86+=H1w;var a86=N0w;a86+=C0w;a86+=y9w;a86+=a5n;var z86=b0j;z86+=J8w;var procClass=this[i2w][z86][a86];$([e0j,this[Q6w][M86]])[n0n](procClass,processing);this[l9w][o9n]=processing;this[U86](X0j,[processing]);};Editor[J86][I0j]=function(args){var processing=R8w;$[z9n](this[l9w][y3n],function(name,field){var o86=Y7b;o86+=c1w;E1aa.W2x();if(field[o86]()){processing=s8w;}});if(processing){var u86=D4w;u86+=T9w;u86+=H9w;this[u86](Y9n,function(){if(this[I0j](args) === s8w){var Q86=e4w;Q86+=l9w;Q86+=F4b;Q86+=i9w;this[Q86][q1n](this,args);}});}return !processing;};Editor[W86][i0j]=function(successCallback,errorCallback,formatdata,hide){var u0j="nged";var x1j="submitCom";var p0j="editCo";var j0j="_noPro";var d1j="omplete";var M0j="bjectD";var o0j="dbTable";var F0j="unt";var a0j="_fnSetO";var G1j="functio";var g1j='preSubmit';var O1j='allIfChanged';var U0j="ataFn";var B0j="db";var N36=z2n;E1aa.n2x();N36+=m0b;var y36=t3b;y36+=D4w;y36+=z3w;y36+=H9w;var D36=H9w;D36+=E1aa[540234];D36+=y9w;D36+=i9w;var l36=B0j;l36+=o0w;l36+=s2w;var H36=j0j;H36+=n1w;H36+=c1w;var Z36=p0j;Z36+=F0j;var c86=E1aa[540234];c86+=z0j;c86+=G2w;var n86=a0j;n86+=M0j;n86+=U0j;var Y86=H9w;Y86+=e1w;Y86+=i9w;var that=this;var i,iLen,eventRet,errorNodes;var changed=R8w,allData={},changedData={};var setBuilder=DataTable[Y86][J0j][n86];var dataSource=this[l9w][c86];var fields=this[l9w][y3n];var editCount=this[l9w][Z36];var modifier=this[l9w][W1b];var editFields=this[l9w][T3n];var editData=this[l9w][o6b];var opts=this[l9w][z3n];var changedSubmit=opts[e0n];var submitParamsLocal;if(this[H36](arguments) === R8w){return;}var action=this[l9w][D3n];var submitParams={"data":{}};submitParams[this[l9w][s8b]]=action;if(this[l9w][l36]){var v36=i9w;v36+=X6n;v36+=Z9w;v36+=H9w;submitParams[v36]=this[l9w][o0j];}if(action === x9b || action === D36){var S36=f0w;S36+=Z2w;S36+=u0j;var E36=j7b;E36+=Z9w;var g36=W4w;g36+=V8n;$[z9n](editFields,function(idSrc,edit){var Q0j="isEmpty";var n0j="ject";var Y0j="Ob";var W0j="Empty";var r36=Q0j;r36+=e3b;r36+=C0w;var d36=y1n;d36+=W0j;d36+=Y0j;d36+=n0j;var allRowData={};var changedRowData={};$[z9n](fields,function(name,field){var c0j="sub";var D1j="sArr";var q1j='[]';var v1j="exOf";var m1j='-many-count';var L1j=/\[.*$/;var h1j="alFromD";var Z1j="mit";var h36=c0j;h36+=Z1j;h36+=H1j;h36+=H9w;if(edit[y3n][name] && field[h36]()){var k36=s8n;k36+=A8b;k36+=l1j;var G36=B0w;G36+=F7n;var O36=t0w;O36+=E1aa[540234];O36+=v1j;var m36=y9w;m36+=D1j;m36+=E9n;var multiGet=field[Y1b]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var L36=E1aa[540234];L36+=N0w;L36+=i9w;L36+=N0w;var q36=z3w;q36+=h1j;q36+=M3w;var originalVal=field[q36](edit[L36]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[m36](value) && name[O36](q1j) !== -q2l?setBuilder(name[L0n](L1j,H8w) + m1j):p6w;builder(allRowData,value);if(manyBuilder){var x36=A8w;x36+=F0n;x36+=d5w;manyBuilder(allRowData,value[x36]);}if(action === G36 && (!editData[name] || !field[k36](value,editData[name][idSrc]))){builder(changedRowData,value);changed=s8w;if(manyBuilder){manyBuilder(changedRowData,value[N8w]);}}}});if(!$[d36](allRowData)){allData[idSrc]=allRowData;}if(!$[r36](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === g36 || changedSubmit === E36 || changedSubmit === O1j && changed){var V36=E1aa[540234];V36+=N0w;V36+=i9w;V36+=N0w;submitParams[V36]=allData;}else if(changedSubmit === S36 && changed){var t36=v9w;t36+=i9w;t36+=N0w;submitParams[t36]=changedData;}else {var f36=x1j;f36+=Q7b;var A36=G1j;A36+=T9w;var P36=k1j;P36+=d1j;var K36=i4n;K36+=D4w;K36+=l9w;K36+=H9w;this[l9w][D3n]=p6w;if(opts[o2b] === K36 && (hide === undefined || hide)){this[q2n](R8w);}else if(typeof opts[P36] === A36){opts[o2b](this);}if(successCallback){successCallback[c2n](this);}this[j4b](R8w);this[G4b](f36);return;}}else if(action === y36){var w36=H9w;w36+=N0w;w36+=f0w;w36+=d5w;$[w36](editFields,function(idSrc,edit){var R36=E1aa[540234];R36+=N0w;R36+=t0n;E1aa.W2x();submitParams[R36][idSrc]=edit[m6w];});}this[r1j](o9j,action,submitParams);submitParamsLocal=$[N36](s8w,{},submitParams);if(formatdata){formatdata(submitParams);}this[G4b](g1j,[submitParams,action],function(result){E1aa.W2x();var S1j="rl";var E1j="Ta";if(result === R8w){var C36=e4w;C36+=k4w;C36+=G2w;C36+=J8w;that[C36](R8w);}else {var e36=i0j;e36+=E1j;e36+=h3n;var b36=t4n;b36+=C8w;b36+=F3n;var s36=a5b;s36+=V1j;s36+=S1j;var T36=N0w;T36+=C8w;T36+=N0w;T36+=e1w;var submitWire=that[l9w][T36] || that[l9w][s36]?that[b36]:that[e36];submitWire[c2n](that,submitParams,function(json,notGood,xhr){var t1j="_submitSuccess";var X36=N0w;X36+=O2w;that[t1j](json,notGood,submitParams,submitParamsLocal,that[l9w][X36],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var K1j="_submitError";that[K1j](xhr,err,thrown,errorCallback,submitParams,that[l9w][D3n]);},submitParams);}});};Editor[I36][P1j]=function(data,success,error,submitParams){var T1j="ataS";var f1j="_fnS";var y1j="etOb";var z36=A1j;z36+=H9w;var F36=f1j;F36+=y1j;E1aa.W2x();F36+=w1j;var p36=D4w;p36+=R1j;p36+=y9w;var j36=y9w;j36+=T3b;j36+=N1j;var B36=H9w;B36+=e1w;B36+=i9w;var i36=l0n;i36+=i9w;i36+=C1n;var that=this;var action=data[i36];var out={data:[]};var idGet=DataTable[B36][J0j][C1j](this[l9w][j36]);var idSet=DataTable[A1n][p36][F36](this[l9w][e8b]);if(action !== z36){var u36=E1aa[540234];u36+=N0w;u36+=i9w;u36+=N0w;var o36=t4w;o36+=T1j;o36+=s1j;o36+=H9w;var J36=r9b;J36+=g9b;var U36=V5w;U36+=y9w;U36+=t1w;U36+=K5w;var M36=L0w;M36+=C2w;var a36=L0w;a36+=D4w;a36+=E1aa[540234];a36+=H9w;var originalData=this[l9w][a36] === M36?this[D6n](U36,this[J36]()):this[o36](n0b,this[W1b]());$[z9n](data[u36],function(key,vals){var b1j="pus";var X1j="_fnExtend";var Y36=b1j;Y36+=d5w;var W36=W4w;W36+=y1w;W36+=H9w;var Q36=V5w;Q36+=T9w;var toSave;var extender=$[Q36][e1j][J0j][X1j];E1aa.W2x();if(action === V5b){var rowData=originalData[key][m6w];toSave=extender({},rowData,s8w);toSave=extender(toSave,vals,s8w);}else {toSave=extender({},vals,s8w);}var overrideId=idGet(toSave);if(action === W36 && overrideId === undefined){idSet(toSave,+new Date() + H8w + key);}else {idSet(toSave,overrideId);}out[m6w][Y36](toSave);});}success(out);};Editor[n36][c36]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var p1j="editOpt";var P4j="tio";var q4j='postCreate';var V4j="taSource";var i1j="Compl";var z1j="fieldErrors";var A4j="onCompl";var r4j="aS";var O4j="Edi";var M1j="ev";var k4j="ommit";var S4j='prep';E1aa.W2x();var m4j="taS";var K4j='postRemove';var H4j="_dataS";var I1j="submi";var a1j="itUnsuccessful";var D4j='setData';var l4j="ource";var x4j='postEdit';var h4j='preCreate';var G4j='commit';var t4j='preRemove';var c1j="tSuccess";var j1j="ece";var v4j="crea";var g4j="rce";var u66=I1j;u66+=i9w;u66+=i1j;u66+=K1w;var o66=u5b;o66+=i9w;var J66=e4w;J66+=V0w;J66+=B1j;var l66=z9w;l66+=j1j;l66+=y9w;l66+=a5n;var H66=p1j;H66+=l9w;var Z66=t5w;Z66+=K5w;var that=this;var setData;var fields=this[l9w][Z66];var opts=this[l9w][H66];var modifier=this[l9w][W1b];this[r1j](l66,action,json);this[G4b](F1j,[json,submitParams,action,xhr]);if(!json[a2w]){var v66=H9w;v66+=F7b;v66+=D4w;v66+=z9w;json[v66]=E1aa[409963];}if(!json[z1j]){json[z1j]=[];}if(notGood || json[a2w] || json[z1j][N8w]){var S66=Q2b;S66+=a1j;var V66=e4w;V66+=M1j;V66+=B5w;var E66=o8w;E66+=y5w;E66+=z9w;E66+=W8w;var g66=W2w;g66+=z1w;var globalError=[];if(json[a2w]){var D66=n9w;D66+=c9w;D66+=l9w;D66+=d5w;globalError[D66](json[a2w]);}$[z9n](json[z1j],function(i,err){var Q1j='focus';var o1j="nct";var Y1j="position";var n1j="onFieldError";var W1j="dyContent";var J1j="status";var U1j="nknown field: ";var u1j="nFieldError";var h66=T9w;h66+=N0w;h66+=L0w;h66+=H9w;var field=fields[err[h66]];if(!field){var q66=V1j;q66+=U1j;throw new Error(q66 + err[h6w]);}else if(field[S0b]()){field[a2w](err[J1j] || N0b);if(i === h2l){var k66=f3b;k66+=o1j;k66+=C1n;var L66=D4w;L66+=u1j;if(opts[L66] === Q1j){var G66=V5w;G66+=v9n;G66+=W5w;var x66=i9w;x66+=D4w;x66+=n9w;var O66=q4n;O66+=W1j;var m66=T5n;m66+=s5n;that[m66]($(that[Q6w][O66],that[l9w][h4n]),{scrollTop:$(field[x3n]())[Y1j]()[x66]},j2l);field[G66]();}else if(typeof opts[n1j] === k66){opts[n1j](that,err);}}}else {var r66=x9n;r66+=y1w;r66+=W5w;var d66=S1b;d66+=W7w;globalError[F9n](field[h6w]() + d66 + (err[r66] || N0b));}});this[g66](globalError[F3b](E66));this[V66](S66,[json]);if(errorCallback){var t66=h6b;t66+=q6b;errorCallback[t66](that,json);}}else {var U66=l9w;U66+=F4b;U66+=c1j;var M66=e4w;M66+=M1j;M66+=B5w;var b66=z9w;b66+=H9w;b66+=Z4j;var store={};if(json[m6w] && (action === x9b || action === x6w)){var f66=Z9w;f66+=H9w;f66+=T9w;f66+=f8w;var A66=E1aa[540234];A66+=N0w;A66+=t0n;var P66=n9w;P66+=x3w;P66+=n9w;var K66=H4j;K66+=l4j;this[K66](P66,action,modifier,submitParamsLocal,json,store);for(var i=h2l;i < json[A66][f66];i++){var R66=v4j;R66+=S9w;var w66=y9w;w66+=E1aa[540234];var y66=t4w;y66+=z0j;y66+=f0w;y66+=H9w;setData=json[m6w][i];var id=this[y66](w66,setData);this[G4b](D4j,[json,setData,action]);if(action === R66){var N66=e4w;N66+=M1j;N66+=B5w;this[N66](h4j,[json,setData,id]);this[D6n](j6w,fields,setData,store);this[G4b]([j6w,q4j],[json,setData,id]);}else if(action === x6w){var s66=L4j;s66+=m4j;s66+=s1j;s66+=H9w;var T66=V0w;T66+=H9w;T66+=O4j;T66+=i9w;var C66=l4b;C66+=B5w;this[C66](T66,[json,setData,id]);this[s66](V5b,modifier,fields,setData,store);this[G4b]([V5b,x4j],[json,setData,id]);}}this[D6n](G4j,action,modifier,json[m6w],store);}else if(action === b66){var j66=f0w;j66+=k4j;var B66=d4j;B66+=r4j;B66+=J5w;B66+=g4j;var i66=y9w;i66+=E1aa[540234];i66+=l9w;var I66=z9w;I66+=E4j;var X66=l4b;X66+=B5w;var e66=e4w;e66+=v9w;e66+=V4j;this[e66](S4j,action,modifier,submitParamsLocal,json,store);this[X66](t4j,[json,this[B0b]()]);this[D6n](I66,modifier,fields,store);this[G4b]([t5b,K4j],[json,this[i66]()]);this[B66](j66,action,modifier,json[m6w],store);}if(editCount === this[l9w][h9j]){var z66=f0w;z66+=b1n;var F66=k1j;F66+=U8w;F66+=Q7b;var p66=N0w;p66+=f0w;p66+=P4j;p66+=T9w;var action=this[l9w][p66];this[l9w][D3n]=p6w;if(opts[F66] === z66 && (hide === undefined || hide)){this[q2n](json[m6w]?s8w:R8w,action);}else if(typeof opts[o2b] === E1aa[363362]){var a66=A4j;a66+=K1w;opts[a66](this);}}if(successCallback){successCallback[c2n](that,json);}this[M66](U66,[json,setData,action]);}this[J66](R8w);this[o66](u66,[json,setData,action]);};Editor[k2w][Q66]=function(xhr,err,thrown,errorCallback,submitParams,action){var w4j='submitError';var f4j="ys";var Y66=l9w;Y66+=f4j;Y66+=i9w;Y66+=y4j;var W66=v2n;W66+=z3w;W66+=B5w;this[W66](F1j,[p6w,submitParams,action,xhr]);this[a2w](this[W0n][a2w][Y66]);E1aa.n2x();this[j4b](R8w);if(errorCallback){var n66=f0w;n66+=N0w;n66+=Z9w;n66+=Z9w;errorCallback[n66](this,xhr,err,thrown);}this[G4b]([w4j,R4j],[xhr,err,thrown,submitParams]);};Editor[k2w][f9b]=function(fn){var s4j="bServerSide";var N4j="bble";var v26=y5w;v26+=c9w;v26+=N4j;var l26=c5n;l26+=C4j;var Z26=X8w;Z26+=I8w;var c66=E1aa[540234];c66+=M3w;c66+=w8b;var that=this;var dt=this[l9w][i0n]?new $[k9n][c66][J3w](this[l9w][i0n]):p6w;var ssp=R8w;if(dt){ssp=dt[O1n]()[h2l][T4j][s4j];}if(this[l9w][Z26]){this[b4j](R4j,function(){E1aa.W2x();var e4j="aw";if(ssp){var H26=E1aa[540234];H26+=z9w;H26+=e4j;dt[b4j](H26,fn);}else {setTimeout(function(){E1aa.n2x();fn();},d2l);}});return s8w;}else if(this[G9n]() === P5b || this[l26]() === v26){var h26=f0w;h26+=b1n;var D26=D4w;D26+=T9w;D26+=H9w;this[D26](h26,function(){E1aa.W2x();var q26=X8w;q26+=X7b;q26+=Q7w;if(!that[l9w][q26]){setTimeout(function(){E1aa.n2x();if(that[l9w]){fn();}},d2l);}else {that[b4j](R4j,function(e,json){E1aa.W2x();if(ssp && json){var m26=E1aa[540234];m26+=z9w;m26+=N0w;m26+=C1w;var L26=D4w;L26+=T9w;L26+=H9w;dt[L26](m26,fn);}else {setTimeout(function(){if(that[l9w]){fn();}},d2l);}});}})[M3n]();return s8w;}return R8w;};Editor[k2w][O26]=function(name,arr){E1aa.W2x();var x26=Z9w;x26+=q5w;x26+=K0w;x26+=Y7n;for(var i=h2l,ien=arr[x26];i < ien;i++){if(name == arr[i]){return i;}}return -q2l;};Editor[G26]={"table":p6w,"ajaxUrl":p6w,"fields":[],"display":k26,"ajax":p6w,"idSrc":X4j,"events":{},"i18n":{"close":d26,"create":{"button":r26,"title":I4j,"submit":g26},"edit":{"button":E26,"title":i4j,"submit":V26},"remove":{"button":S26,"title":B4j,"submit":t26,"confirm":{"_":j4j,"1":K26}},"error":{"system":P26},multi:{title:p4j,info:A26,restore:f26,noMulti:y26},datetime:{previous:w26,next:F4j,months:[z4j,a4j,M4j,R26,U4j,J4j,o4j,N26,C26,u4j,Q4j,T26],weekdays:[s26,W4j,Y4j,b26,e26,n4j,c4j],amPm:[Z5j,H5j],hours:l5j,minutes:X26,seconds:v5j,unknown:P4b}},formOptions:{bubble:$[c3w]({},Editor[L1n][I26],{title:R8w,message:R8w,buttons:i26,submit:D5j}),inline:$[c3w]({},Editor[L1n][B26],{buttons:R8w,submit:j26}),main:$[c3w]({},Editor[p26][F26])},legacyAjax:R8w,actionName:z26};(function(){var u7j='data-editor-value';var v7j="aT";var Q5j="oAp";var p7j="[data-edit";E1aa.W2x();var m7j="rowIds";var A5j="gs";var D1H=d5w;D1H+=i9w;D1H+=L0w;D1H+=Z9w;var __dataSources=Editor[X8b]={};var __dtIsSsp=function(dt,editor){var q5j="bSer";var m5j="oFeatur";E1aa.W2x();var h5j="drawT";var L5j="Sid";var o26=U9n;o26+=w9w;var J26=h5j;J26+=J1w;var U26=q5j;U26+=S7w;U26+=L5j;U26+=H9w;var M26=m5j;M26+=R0w;var a26=y4w;a26+=Q3w;return dt[a26]()[h2l][M26][U26] && editor[l9w][z3n][J26] !== o26;};var __dtApi=function(table){return $(table)[O5j]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){E1aa.W2x();var x5j="addCla";var G5j='highlight';var u26=x5j;u26+=w0w;node[u26](G5j);setTimeout(function(){var k5j="ghligh";var r5j="Highli";var d5j="eCla";var n26=d5w;n26+=y9w;n26+=k5j;n26+=i9w;var Y26=A1j;Y26+=d5j;Y26+=w0w;var W26=U9n;W26+=r5j;W26+=N8n;W26+=i9w;var Q26=N0w;Q26+=g6n;Q26+=S3b;node[Q26](W26)[Y26](n26);setTimeout(function(){var g5j="H";var E5j="ighlight";E1aa.W2x();var c26=U9n;c26+=g5j;c26+=E5j;node[N2n](c26);},p2l);},j2l);},t2l);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){dt[D0b](identifier)[V5j]()[z9n](function(idx){var S5j='Unable to find row identifier';var V2l=14;var l9H=z9w;l9H+=D4w;l9H+=C1w;var Z9H=v9w;E1aa.n2x();Z9H+=i9w;Z9H+=N0w;var row=dt[O3n](idx);var data=row[Z9H]();var idSrc=idFn(data);if(idSrc === undefined){var H9H=H9w;H9H+=F7b;H9H+=D4w;H9H+=z9w;Editor[H9H](S5j,V2l);}out[idSrc]={idSrc:idSrc,data:data,node:row[x3n](),fields:fields,type:l9H};});};var __dtFieldsFromIdx=function(dt,fields,idx){var y5j="editField";var f5j="aoColumns";var P5j="tin";var T5j=" field from source. Please specify the";E1aa.W2x();var N5j="Unable to automati";var C5j="cally determine";var t5j="EmptyObjec";var K5j="editFi";var s5j=" field name.";var O9H=y1n;O9H+=t5j;O9H+=i9w;var h9H=L0w;h9H+=V9w;h9H+=i9w;h9H+=N0w;var D9H=K5j;D9H+=g4w;var v9H=H7w;v9H+=P5j;v9H+=A5j;var field;var col=dt[v9H]()[h2l][f5j][idx];var dataSrc=col[y5j] !== undefined?col[D9H]:col[h9H];var resolvedFields={};var run=function(field,dataSrc){var w5j="am";if(field[h6w]() === dataSrc){var q9H=T9w;q9H+=w5j;q9H+=H9w;resolvedFields[field[q9H]()]=field;}};$[z9n](fields,function(name,fieldInst){var R5j="rra";var L9H=Q6b;L9H+=R5j;L9H+=x0w;if(Array[L9H](dataSrc)){var m9H=Z9w;m9H+=x2n;for(var i=h2l;i < dataSrc[m9H];i++){run(fieldInst,dataSrc[i]);}}else {run(fieldInst,dataSrc);}});if($[O9H](resolvedFields)){var G9H=N5j;G9H+=C5j;G9H+=T5j;G9H+=s5j;var x9H=H9w;x9H+=G5w;x9H+=z9w;Editor[x9H](G9H,r2l);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var d9H=c8n;d9H+=f0w;d9H+=d5w;var k9H=f0w;k9H+=t1w;k9H+=X0w;E1aa.W2x();dt[k9H](identifier)[V5j]()[d9H](function(idx){var X5j="fixe";var B5j="bje";var p5j="column";var I5j="dN";var i5j="ttac";var j5j="cell";var b5j="displayFie";var z5j="fixedNode";var P9H=b5j;P9H+=Z9w;P9H+=E1aa[540234];P9H+=l9w;var K9H=H9w;K9H+=e5j;K9H+=E1aa[540234];var t9H=T9w;t9H+=n2n;var S9H=X5j;S9H+=I5j;S9H+=n2n;var V9H=N0w;V9H+=i5j;V9H+=d5w;var E9H=D4w;E9H+=B5j;E9H+=f0w;E9H+=i9w;var g9H=E1aa[540234];g9H+=N0w;E1aa.n2x();g9H+=i9w;g9H+=N0w;var r9H=z9w;r9H+=D4w;r9H+=C1w;var cell=dt[j5j](idx);var row=dt[O3n](idx[r9H]);var data=row[g9H]();var idSrc=idFn(data);var fields=forceFields || __dtFieldsFromIdx(dt,allFields,idx[p5j]);var isNode=typeof identifier === E9H && identifier[F5j] || identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){prevAttach=out[idSrc][H3n];prevDisplayFields=out[idSrc][v1b];}__dtRowSelector(out,dt,idx[O3n],allFields,idFn);out[idSrc][V9H]=prevAttach || [];out[idSrc][H3n][F9n](isNode?$(identifier)[P0n](h2l):cell[S9H]?cell[z5j]():cell[t9H]());out[idSrc][v1b]=prevDisplayFields || ({});$[K9H](out[idSrc][P9H],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var a5j="lls";E1aa.n2x();var f9H=H9w;f9H+=N0w;f9H+=f0w;f9H+=d5w;var A9H=G2w;A9H+=a5j;dt[A9H](p6w,identifier)[V5j]()[f9H](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var M5j="plac";var U5j='\\$1';var w9H=x3w;w9H+=M5j;w9H+=H9w;var y9H=l9w;y9H+=i9w;y9H+=z9w;y9H+=Q7w;return typeof id === y9H?p0b + id[w9H](/(:|\.|\[|\]|,)/g,U5j):p0b + id;};__dataSources[Z3n]={id:function(data){var o5j="ObjectDataFn";var J5j="_fnG";var N9H=J5j;N9H+=K9n;N9H+=o5j;var R9H=D4w;R9H+=R1j;R9H+=y9w;var idFn=DataTable[A1n][R9H][N9H](this[l9w][e8b]);return idFn(data);},individual:function(identifier,fieldNames){var u5j="Sr";var s9H=y9w;s9H+=E1aa[540234];s9H+=u5j;s9H+=f0w;var T9H=Q5j;T9H+=y9w;var C9H=H9w;C9H+=V4b;var idFn=DataTable[C9H][T9H][C1j](this[l9w][s9H]);var dt=__dtApi(this[l9w][i0n]);var fields=this[l9w][y3n];var out={};var forceFields;var responsiveNode;if(fieldNames){var b9H=c8n;b9H+=f0w;b9H+=d5w;if(!Array[r0n](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[b9H](fieldNames,function(i,name){E1aa.n2x();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var W5j="_fn";var c5j="cells";var H7j="mns";var Y5j="GetOb";var Z7j="colu";var j9H=r3n;j9H+=l9w;var B9H=i9w;B9H+=s2w;var i9H=y9w;i9H+=T3b;i9H+=N1j;var I9H=W5j;I9H+=Y5j;I9H+=w1j;var X9H=D4w;X9H+=J3w;var e9H=H9w;e9H+=e1w;e9H+=i9w;var idFn=DataTable[e9H][X9H][I9H](this[l9w][i9H]);var dt=__dtApi(this[l9w][B9H]);var fields=this[l9w][j9H];var out={};if($[l6n](identifier) && (identifier[D0b] !== undefined || identifier[n5j] !== undefined || identifier[c5j] !== undefined)){var M9H=G2w;M9H+=Z9w;M9H+=X0w;var z9H=Z7j;z9H+=L0w;z9H+=a6n;var p9H=z9w;p9H+=D4w;p9H+=C1w;p9H+=l9w;if(identifier[p9H] !== undefined){var F9H=H4w;F9H+=C1w;F9H+=l9w;__dtRowSelector(out,dt,identifier[F9H],fields,idFn);}if(identifier[z9H] !== undefined){var a9H=Z7j;a9H+=H7j;__dtColumnSelector(out,dt,identifier[a9H],fields,idFn);}if(identifier[M9H] !== undefined){__dtCellSelector(out,dt,identifier[c5j],fields,idFn);}}else {__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[l9w][i0n]);E1aa.W2x();if(!__dtIsSsp(dt,this)){var o9H=U9n;o9H+=E1aa[540234];o9H+=H9w;var J9H=N0w;J9H+=E1aa[540234];J9H+=E1aa[540234];var U9H=H4w;U9H+=C1w;var row=dt[U9H][J9H](data);__dtHighlight(row[o9H]());}},edit:function(identifier,fields,data,store){E1aa.W2x();var q7j="oA";var D7j="inArr";var L7j="pi";var l7j="drawType";var h7j="fnE";var that=this;var dt=__dtApi(this[l9w][i0n]);if(!__dtIsSsp(dt,this) || this[l9w][z3n][l7j] === V9n){var c9H=N0w;c9H+=T9w;c9H+=x0w;var Q9H=N0w;Q9H+=T9w;Q9H+=x0w;var u9H=f0w;u9H+=v1n;var rowId=__dataSources[Z3n][r5w][u9H](this,data);var row;try{row=dt[O3n](__dtjqId(rowId));}catch(e){row=dt;}if(!row[Q9H]()){var W9H=z9w;W9H+=D4w;W9H+=C1w;row=dt[W9H](function(rowIdx,rowData,rowNode){var n9H=f0w;n9H+=N0w;n9H+=Z9w;n9H+=Z9w;var Y9H=G6w;Y9H+=v7j;Y9H+=X6n;Y9H+=b5w;return rowId == __dataSources[Y9H][r5w][n9H](that,rowData);});}if(row[c9H]()){var v0H=D7j;v0H+=N0w;v0H+=x0w;var l0H=E1aa[540234];l0H+=N0w;l0H+=i9w;l0H+=N0w;var H0H=e4w;H0H+=h7j;H0H+=V4b;H0H+=i5w;var Z0H=q7j;Z0H+=L7j;var extender=$[k9n][e1j][Z0H][H0H];var toSave=extender({},row[m6w](),s8w);toSave=extender(toSave,data,s8w);row[l0H](toSave);var idx=$[v0H](rowId,store[m7j]);store[m7j][i3n](idx,q2l);}else {var D0H=N0w;D0H+=E1aa[540234];D0H+=E1aa[540234];row=dt[O3n][D0H](data);}__dtHighlight(row[x3n]());}},remove:function(identifier,fields,store){var O7j="cancelled";var x7j="eve";var h0H=t0n;h0H+=a5w;h0H+=H9w;E1aa.n2x();var that=this;var dt=__dtApi(this[l9w][h0H]);var cancelled=store[O7j];if(cancelled[N8w] === h2l){var L0H=x3w;L0H+=h7w;L0H+=z3w;L0H+=H9w;var q0H=z9w;q0H+=D4w;q0H+=H0b;dt[q0H](identifier)[L0H]();}else {var g0H=x3w;g0H+=L0w;g0H+=K3b;var r0H=z9w;r0H+=D4w;r0H+=C1w;r0H+=l9w;var O0H=x7j;O0H+=z9w;O0H+=x0w;var m0H=z9w;m0H+=D4w;m0H+=C1w;m0H+=l9w;var indexes=[];dt[m0H](identifier)[O0H](function(){var G7j="aTable";var d0H=E1aa[540234];d0H+=N0w;E1aa.n2x();d0H+=i9w;d0H+=N0w;var k0H=f0w;k0H+=v1n;var G0H=y9w;G0H+=E1aa[540234];var x0H=G6w;x0H+=G7j;var id=__dataSources[x0H][G0H][k0H](that,this[d0H]());if($[I3n](id,cancelled) === -q2l){indexes[F9n](this[k7j]());}});dt[r0H](indexes)[g0H]();}},prep:function(action,identifier,submit,json,store){var d7j="Ids";var r7j="ancelle";var V7j="canc";E1aa.n2x();var t7j="elled";var S7j="lled";if(action === V5b){var S0H=E1aa[540234];S0H+=N0w;S0H+=t0n;var V0H=O3n;V0H+=d7j;var E0H=f0w;E0H+=r7j;E0H+=E1aa[540234];var cancelled=json[E0H] || [];store[V0H]=$[t0b](submit[S0H],function(val,key){var E7j="isEmptyObject";var g7j="inArra";var t0H=g7j;t0H+=x0w;return !$[E7j](submit[m6w][key]) && $[t0H](key,cancelled) === -q2l?key:undefined;});}else if(action === t5b){var P0H=V7j;P0H+=H9w;P0H+=S7j;var K0H=V7j;K0H+=t7j;store[K0H]=json[P0H] || [];}},commit:function(action,identifier,data,store){var e7j="ive";var b7j="respon";var R7j="bServ";var T7j="ett";var K7j="drawTyp";var B7j="rebuildPane";var s7j="cti";var I7j="responsive";var i7j="searchPanes";var A7j="rve";var f7j="rSide";var N7j="erS";var y7j="sett";var X7j="ecal";var e0H=U9n;e0H+=T9w;e0H+=H9w;var b0H=K7j;b0H+=H9w;var A0H=b5w;A0H+=X9b;A0H+=i9w;A0H+=d5w;var that=this;var dt=__dtApi(this[l9w][i0n]);if(!__dtIsSsp(dt,this) && action === V5b && store[m7j][A0H]){var R0H=A8w;R0H+=f8w;var ids=store[m7j];var row;var compare=function(id){return function(rowIdx,rowData,rowNode){var w0H=h6b;w0H+=q6b;E1aa.n2x();var y0H=y9w;y0H+=E1aa[540234];var f0H=E1aa[540234];f0H+=y1w;f0H+=v7j;f0H+=s2w;return id == __dataSources[f0H][y0H][w0H](that,rowData);};};for(var i=h2l,ien=ids[R0H];i < ien;i++){var s0H=y5w;s0H+=P7j;s0H+=A7j;s0H+=f7j;var T0H=y7j;T0H+=y9w;T0H+=X9b;T0H+=l9w;try{var N0H=H4w;N0H+=C1w;row=dt[N0H](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[w7j]()){var C0H=z9w;C0H+=D4w;C0H+=C1w;row=dt[C0H](compare(ids[i]));}if(row[w7j]() && !dt[T0H]()[h2l][T4j][s0H]){row[f0n]();}}}var drawType=this[l9w][z3n][b0H];if(drawType !== e0H){var p0H=R7j;p0H+=N7j;p0H+=C7j;var j0H=l9w;j0H+=T7j;j0H+=t0w;j0H+=A5j;var B0H=m2w;B0H+=s7j;B0H+=T0w;var I0H=b7j;I0H+=l9w;I0H+=e7j;var X0H=E1aa[540234];X0H+=z9w;X0H+=N0w;X0H+=C1w;dt[X0H](drawType);if(dt[I0H]){var i0H=z9w;i0H+=X7j;i0H+=f0w;dt[I7j][i0H]();}if(typeof dt[i7j] === B0H && !dt[j0H]()[h2l][T4j][p0H]){dt[i7j][B7j](undefined,s8w);}}}};function __html_id(identifier){var a7j="uld not find an element with `data-editor-id` or `id` of: ";var j7j="keyl";var z7j="Co";var F7j="or-id=\"";var F0H=j7j;F0H+=R0w;F0H+=l9w;var context=document;E1aa.n2x();if(identifier !== F0H){var z0H=p7j;z0H+=F7j;context=$(z0H + identifier + G8w);if(context[N8w] === h2l){context=typeof identifier === o2n?$(__dtjqId(identifier)):$(identifier);}if(context[N8w] === h2l){var a0H=z7j;a0H+=a7j;throw a0H + identifier;}}return context;}function __html_el(identifier,name){var M7j='[data-editor-field="';var M0H=x8w;E1aa.W2x();M0H+=B6b;var context=__html_id(identifier);return $(M7j + name + M0H,context);}function __html_els(identifier,names){var out=$();for(var i=h2l,ien=names[N8w];i < ien;i++){var U0H=N0w;U0H+=g6n;out=out[U0H](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var J7j="or-value]";var o0H=U7j;o0H+=d5w;var J0H=p7j;J0H+=J7j;var el=__html_el(identifier,dataSrc);return el[o7j](J0H)[o0H]?el[b5b](u7j):el[P9n]();}function __html_set(identifier,fields,data){E1aa.W2x();$[z9n](fields,function(name,field){var Q7j="[data";var W7j="-editor-value]";var Y7j="ataSr";var val=field[W6b](data);if(val !== undefined){var Y0H=Z9w;Y0H+=x2n;var W0H=Q7j;W0H+=W7j;var Q0H=R5b;Q0H+=i9w;Q0H+=H9w;Q0H+=z9w;var u0H=E1aa[540234];u0H+=Y7j;u0H+=f0w;var el=__html_el(identifier,field[u0H]());if(el[Q0H](W0H)[Y0H]){var n0H=N0w;n0H+=i9w;n0H+=e5w;el[n0H](u7j,val);}else {var c0H=H9w;c0H+=N0w;c0H+=f0w;c0H+=d5w;el[c0H](function(){var l8j="oveC";var n7j="childNo";var c7j="des";var Z8j="firs";var H8j="Child";var H1H=Z9w;H1H+=H9w;H1H+=C7b;var Z1H=n7j;Z1H+=c7j;while(this[Z1H][H1H]){var v1H=Z8j;v1H+=i9w;v1H+=H8j;var l1H=x3w;l1H+=L0w;l1H+=l8j;l1H+=D7n;this[l1H](this[v1H]);}})[P9n](val);}}});}__dataSources[D1H]={id:function(data){var v8j="_fnGet";var D8j="Objec";var h8j="tDataFn";var L1H=v8j;L1H+=D8j;L1H+=h8j;var q1H=Q5j;q1H+=y9w;var h1H=z2n;h1H+=i9w;var idFn=DataTable[h1H][q1H][L1H](this[l9w][e8b]);return idFn(data);},initField:function(cfg){var q8j='[data-editor-label="';var x1H=Z9w;x1H+=X6n;x1H+=t1w;var O1H=x8w;O1H+=B6b;var m1H=E1aa[540234];m1H+=N0w;m1H+=i9w;m1H+=N0w;var label=$(q8j + (cfg[m1H] || cfg[h6w]) + O1H);if(!cfg[x1H] && label[N8w]){var k1H=d5w;k1H+=i9w;k1H+=L0w;k1H+=Z9w;var G1H=Z9w;G1H+=L8j;cfg[G1H]=label[k1H]();}},individual:function(identifier,fieldNames){var x8j="Self";var O8j="and";var r8j='editor-id';var d8j='[data-editor-id]';var g8j='keyless';var m8j="deNa";var E8j='Cannot automatically determine field name from data source';var k8j='addBack';var G8j="-field";var K1H=H9w;K1H+=N0w;K1H+=I0w;var t1H=V5w;t1H+=y9w;t1H+=i0b;var S1H=f0w;S1H+=j7b;S1H+=Z9w;var V1H=d5w;V1H+=v0j;var d1H=T9w;d1H+=D4w;d1H+=m8j;d1H+=x9w;var attachEl;if(identifier instanceof $ || identifier[d1H]){var E1H=O8j;E1H+=x8j;var g1H=V5w;g1H+=T9w;attachEl=identifier;if(!fieldNames){var r1H=m8w;r1H+=c4b;r1H+=G8j;fieldNames=[$(identifier)[b5b](r1H)];}var back=$[g1H][F1b]?k8j:E1H;identifier=$(identifier)[T2w](d8j)[back]()[m6w](r8j);}if(!identifier){identifier=g8j;}if(fieldNames && !Array[r0n](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[N8w] === h2l){throw E8j;}var out=__dataSources[V1H][y3n][S1H](this,identifier);var fields=this[l9w][t1H];var forceFields={};$[K1H](fieldNames,function(i,name){forceFields[name]=fields[name];});$[z9n](out,function(id,set){var w1H=c2l;w1H+=g4w;w1H+=l9w;var y1H=k5w;y1H+=N3b;y1H+=z9w;y1H+=E9n;var f1H=y1w;f1H+=t0n;f1H+=I0w;var A1H=f0w;A1H+=H9w;A1H+=Z9w;A1H+=Z9w;var P1H=B3w;E1aa.W2x();P1H+=n9w;P1H+=H9w;set[P1H]=A1H;set[f1H]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[y1H]();set[w1H]=fields;set[v1b]=forceFields;});return out;},fields:function(identifier){var t8j="ields";var V8j="Array";var K8j="yless";var i1H=z9w;i1H+=D4w;i1H+=C1w;var e1H=c8n;e1H+=I0w;var s1H=c2l;s1H+=t1w;s1H+=E1aa[540234];s1H+=l9w;var N1H=y1n;N1H+=V8j;var R1H=d5w;R1H+=S8j;R1H+=Z9w;var out={};var self=__dataSources[R1H];if(Array[N1H](identifier)){var C1H=T9n;C1H+=Y7n;for(var i=h2l,ien=identifier[C1H];i < ien;i++){var T1H=V5w;T1H+=t8j;var res=self[T1H][c2n](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[l9w][s1H];if(!identifier){var b1H=V7w;b1H+=H9w;b1H+=K8j;identifier=b1H;}$[e1H](fields,function(name,field){var A8j="Src";var P8j="valToDat";E1aa.n2x();var I1H=P8j;I1H+=N0w;var X1H=m6w;X1H+=A8j;var val=__html_get(identifier,field[X1H]());field[I1H](data,val === p6w?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:i1H};return out;},create:function(fields,data){E1aa.W2x();if(data){var j1H=y9w;j1H+=E1aa[540234];var B1H=H5n;B1H+=L0w;B1H+=Z9w;var id=__dataSources[B1H][j1H][c2n](this,data);try{var p1H=b5w;p1H+=C7b;if(__html_id(id)[p1H]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var f8j="keyles";var a1H=f8j;a1H+=l9w;var z1H=y9w;z1H+=E1aa[540234];var F1H=d5w;F1H+=i9w;F1H+=L0w;F1H+=Z9w;var id=__dataSources[F1H][z1H][c2n](this,data) || a1H;__html_set(id,fields,data);},remove:function(identifier,fields){var M1H=t3b;E1aa.n2x();M1H+=D4w;M1H+=a5n;__html_id(identifier)[M1H]();}};})();Editor[U1H]={"wrapper":U9w,"processing":{"indicator":J1H,"active":o1H},"header":{"wrapper":y8j,"content":u1H},"body":{"wrapper":Q1H,"content":W1H},"footer":{"wrapper":Y1H,"content":w8j},"form":{"wrapper":n1H,"content":c1H,"tag":E1aa[409963],"info":Z4H,"error":R8j,"buttons":N8j,"button":C8j,"buttonInternal":C8j},"field":{"wrapper":T8j,"typePrefix":s8j,"namePrefix":b8j,"label":e8j,"input":H4H,"inputControl":l4H,"error":v4H,"msg-label":D4H,"msg-error":h4H,"msg-message":q4H,"msg-info":X8j,"multiValue":I8j,"multiInfo":i8j,"multiRestore":B8j,"multiNoEdit":L4H,"disabled":f2w,"processing":j8j},"actions":{"create":m4H,"edit":O4H,"remove":p8j},"inline":{"wrapper":x4H,"liner":G4H,"buttons":F8j},"bubble":{"wrapper":z8j,"liner":a8j,"table":M8j,"close":U8j,"pointer":k4H,"bg":J8j}};(function(){var W8j="lec";var k3j="formButtons";var D3j="ingle";var q3j="itor_create";var E3j="ubm";var u8j="dSingle";var L3j="BU";var M3j='rows';var Z3j="ableTools";var m3j="TO";var Y8j="s-e";var H6j="removeSingle";var O3j="NS";var Q8j="veSingle";var H3j="tor_";var J3j='buttons-remove';var h3j="editor_";var Z6j="editSingle";var g3j="tedIndexes";var A3j="rm";var l3j="lect";var X3j="formMessage";var I3j="formTitle";var c8j="uttons";var G3j="cr";var T3j='buttons-create';var c5H=o8j;c5H+=H9w;c5H+=u8j;var n5H=z2n;n5H+=i9w;n5H+=i5w;var Y5H=z9w;Y5H+=H9w;Y5H+=Z4j;var W5H=H9w;W5H+=e1w;W5H+=S9w;W5H+=o5w;var Q5H=t3b;Q5H+=D4w;Q5H+=Q8j;var u5H=y4w;u5H+=W8j;u5H+=S9w;u5H+=u8j;var o5H=H9w;o5H+=u3b;var J5H=H9w;J5H+=E1aa[540234];J5H+=y9w;J5H+=i9w;var O5H=G1n;O5H+=Y8j;O5H+=j0b;var D5H=o8j;D5H+=B0w;var M4H=n8j;M4H+=E1aa[540234];var a4H=y5w;a4H+=c8j;var d4H=o0w;d4H+=Z3j;if(DataTable[d4H]){var R4H=g4b;R4H+=H3j;R4H+=A1j;R4H+=H9w;var P4H=y4w;P4H+=l3j;P4H+=v3j;P4H+=D3j;var K4H=z2n;K4H+=J4b;K4H+=E1aa[540234];var t4H=h3j;t4H+=x6w;var E4H=i9w;E4H+=z2n;E4H+=i9w;var g4H=B0w;g4H+=q3j;var r4H=L3j;r4H+=o0w;r4H+=m3j;r4H+=O3j;var ttButtons=DataTable[Y8b][r4H];var ttButtonBase={sButtonText:p6w,editor:p6w,formTitle:p6w};ttButtons[g4H]=$[c3w](s8w,ttButtons[E4H],ttButtonBase,{formButtons:[{label:p6w,fn:function(e){E1aa.n2x();this[e0n]();}}],fnClick:function(button,config){var x3j="be";var S4H=y0w;S4H+=x3j;S4H+=Z9w;var V4H=G3j;V4H+=H9w;V4H+=y1w;V4H+=H9w;var editor=config[c4b];var i18nCreate=editor[W0n][V4H];var buttons=config[k3j];if(!buttons[h2l][S4H]){buttons[h2l][S6w]=i18nCreate[e0n];}editor[x9b]({title:i18nCreate[N6w],buttons:buttons});}});ttButtons[t4H]=$[K4H](s8w,ttButtons[P4H],ttButtonBase,{formButtons:[{label:p6w,fn:function(e){E1aa.W2x();this[e0n]();}}],fnClick:function(button,config){var d3j="edito";var r3j="fnGetSelec";var w4H=B0w;w4H+=F7n;var y4H=y9w;y4H+=v5b;y4H+=T9w;var f4H=d3j;f4H+=z9w;var A4H=r3j;E1aa.W2x();A4H+=g3j;var selected=this[A4H]();if(selected[N8w] !== q2l){return;}var editor=config[f4H];var i18nEdit=editor[y4H][w4H];var buttons=config[k3j];if(!buttons[h2l][S6w]){buttons[h2l][S6w]=i18nEdit[e0n];}editor[x6w](selected[h2l],{title:i18nEdit[N6w],buttons:buttons});}});ttButtons[R4H]=$[c3w](s8w,ttButtons[o8j],ttButtonBase,{question:p6w,formButtons:[{label:p6w,fn:function(e){var N4H=l9w;N4H+=E3j;N4H+=y9w;N4H+=i9w;var that=this;this[N4H](function(json){var K3j="tance";var V3j="ctNone";var P3j="taTable";var t3j="etIns";var S3j="fnG";var b4H=k9n;b4H+=P7j;b4H+=b5w;b4H+=V3j;var s4H=T9w;s4H+=D4w;s4H+=h9w;var T4H=S3j;T4H+=t3j;T4H+=K3j;var C4H=v9w;C4H+=P3j;var tt=$[k9n][C4H][Y8b][T4H]($(that[l9w][i0n])[O5j]()[i0n]()[s4H]());tt[b4H]();});}}],fnClick:function(button,config){var w3j="tSelec";var y3j="fnGe";var f3j="ir";var z4H=Z9w;z4H+=H9w;z4H+=X9b;z4H+=Y7n;var j4H=Z9w;j4H+=N0w;j4H+=y5w;j4H+=t1w;var B4H=f0w;B4H+=z5n;B4H+=y9w;B4H+=A3j;var i4H=s8n;i4H+=T9w;i4H+=c2l;i4H+=A3j;var I4H=t8n;I4H+=f3j;I4H+=L0w;var X4H=A1j;X4H+=H9w;var e4H=y3j;e4H+=w3j;e4H+=g3j;var rows=this[e4H]();E1aa.n2x();if(rows[N8w] === h2l){return;}var editor=config[c4b];var i18nRemove=editor[W0n][X4H];var buttons=config[k3j];var question=typeof i18nRemove[O5b] === o2n?i18nRemove[I4H]:i18nRemove[i4H][rows[N8w]]?i18nRemove[O5b][rows[N8w]]:i18nRemove[B4H][e4w];if(!buttons[h2l][j4H]){var F4H=l9w;F4H+=n5w;var p4H=Z9w;p4H+=L8j;buttons[h2l][p4H]=i18nRemove[F4H];}editor[f0n](rows,{message:question[L0n](/%d/g,rows[z4H]),title:i18nRemove[N6w],buttons:buttons});}});}var _buttons=DataTable[A1n][a4H];$[M4H](_buttons,{create:{text:function(dt,node,config){var N3j=".c";var R3j="ditor";var C3j="reate";var o4H=F5w;o4H+=H2n;var J4H=H9w;J4H+=R3j;var U4H=y5w;U4H+=c8j;U4H+=N3j;U4H+=C3j;return dt[W0n](U4H,config[J4H][W0n][x9b][o4H]);},className:T3j,editor:p6w,formButtons:{text:function(editor){var W4H=Z5w;W4H+=y5w;W4H+=s3j;W4H+=i9w;var Q4H=W4w;Q4H+=N0w;E1aa.n2x();Q4H+=S9w;var u4H=p7n;u4H+=X2n;return editor[u4H][Q4H][W4H];},action:function(e){var Y4H=l9w;Y4H+=F4b;Y4H+=i9w;this[Y4H]();}},formMessage:p6w,formTitle:p6w,action:function(e,dt,node,config){var e3j="ssin";var b3j="reOpe";var v5H=i9w;v5H+=y9w;v5H+=i9w;v5H+=b5w;var l5H=G3j;l5H+=c8n;l5H+=S9w;var H5H=y9w;H5H+=Y3w;H5H+=n3w;H5H+=T9w;var Z5H=L0w;Z5H+=R0w;Z5H+=m5b;var c4H=n9w;c4H+=b3j;c4H+=T9w;var n4H=b0j;n4H+=e3j;n4H+=K0w;var that=this;var editor=config[c4b];this[n4H](s8w);editor[b4j](c4H,function(){that[o9n](R8w);})[x9b]({buttons:config[k3j],message:config[X3j] || editor[W0n][x9b][Z5H],title:config[I3j] || editor[H5H][l5H][v5H]});}},edit:{extend:D5H,text:function(dt,node,config){var B3j='buttons.edit';var m5H=x1b;m5H+=T0w;var L5H=i3j;L5H+=T9w;var q5H=H9w;q5H+=w1w;q5H+=i9w;q5H+=z1w;var h5H=y9w;h5H+=Y3w;h5H+=n3w;h5H+=T9w;return dt[h5H](B3j,config[q5H][L5H][x6w][m5H]);},className:O5H,editor:p6w,formButtons:{text:function(editor){var x5H=y9w;x5H+=v5b;x5H+=T9w;return editor[x5H][x6w][e0n];},action:function(e){var G5H=l9w;G5H+=E3j;E1aa.W2x();G5H+=y9w;G5H+=i9w;this[G5H]();}},formMessage:p6w,formTitle:p6w,action:function(e,dt,node,config){E1aa.W2x();var F3j="ell";var z3j="exe";var j3j="tit";var p3j="indexe";var A5H=j3j;A5H+=b5w;var P5H=L0w;P5H+=H9w;P5H+=w0w;P5H+=k5b;var K5H=H9w;K5H+=E1aa[540234];K5H+=y9w;K5H+=i9w;var t5H=D4w;t5H+=T9w;t5H+=H9w;var S5H=Z9w;S5H+=H9w;S5H+=T9w;S5H+=f8w;var V5H=p3j;V5H+=l9w;var E5H=f0w;E5H+=F3j;E5H+=l9w;var g5H=k7j;g5H+=H9w;g5H+=l9w;var r5H=t0w;r5H+=E1aa[540234];r5H+=z3j;r5H+=l9w;var d5H=O3n;d5H+=l9w;var k5H=H9w;k5H+=E1aa[540234];k5H+=l3b;k5H+=z9w;var that=this;var editor=config[k5H];var rows=dt[d5H]({selected:s8w})[r5H]();var columns=dt[n5j]({selected:s8w})[g5H]();var cells=dt[E5H]({selected:s8w})[V5H]();var items=columns[N8w] || cells[S5H]?{rows:rows,columns:columns,cells:cells}:rows;this[o9n](s8w);editor[t5H](N0j,function(){that[o9n](R8w);})[K5H](items,{buttons:config[k3j],message:config[X3j] || editor[W0n][x6w][P5H],title:config[I3j] || editor[W0n][x6w][A5H]});}},remove:{extend:a3j,limitTo:[M3j],text:function(dt,node,config){var U3j='buttons.remove';var y5H=H5b;y5H+=k5w;y5H+=T9w;var f5H=e2w;f5H+=a5n;return dt[W0n](U3j,config[c4b][W0n][f5H][y5H]);},className:J3j,editor:p6w,formButtons:{text:function(editor){var w5H=y9w;w5H+=Y3w;w5H+=n3w;w5H+=T9w;E1aa.W2x();return editor[w5H][f0n][e0n];},action:function(e){var R5H=l9w;R5H+=n5w;this[R5H]();}},formMessage:function(editor,dt){var u3j="confi";var o3j="nfi";var I5H=f0w;I5H+=D4w;I5H+=o3j;I5H+=A3j;var X5H=s8n;X5H+=o3j;X5H+=A3j;var e5H=b5w;e5H+=C7b;var b5H=f0w;b5H+=D4w;b5H+=o3j;b5H+=A3j;var s5H=u3j;E1aa.n2x();s5H+=z9w;s5H+=L0w;var T5H=Q3j;T5H+=X9b;var C5H=p7n;C5H+=X2n;var N5H=z9w;N5H+=D4w;N5H+=C1w;N5H+=l9w;var rows=dt[N5H]({selected:s8w})[V5j]();var i18n=editor[C5H][f0n];var question=typeof i18n[O5b] === T5H?i18n[s5H]:i18n[b5H][rows[e5H]]?i18n[X5H][rows[N8w]]:i18n[I5H][e4w];return question[L0n](/%d/g,rows[N8w]);},formTitle:p6w,action:function(e,dt,node,config){var W3j="emov";var n3j="rmButtons";var c3j="ndexes";var Y3j="formMes";var U5H=z9w;U5H+=W3j;U5H+=H9w;var M5H=y9w;M5H+=v5b;M5H+=T9w;var a5H=Y3j;a5H+=L9j;a5H+=E5w;var z5H=H0w;z5H+=n3j;var F5H=y9w;F5H+=c3j;var p5H=z9w;E1aa.n2x();p5H+=D4w;p5H+=C1w;p5H+=l9w;var B5H=D4w;B5H+=T9w;B5H+=H9w;var i5H=k4w;i5H+=M1w;i5H+=t0w;i5H+=K0w;var that=this;var editor=config[c4b];this[i5H](s8w);editor[B5H](N0j,function(){var j5H=V0w;j5H+=B1j;that[j5H](R8w);})[f0n](dt[p5H]({selected:s8w})[F5H](),{buttons:config[z5H],message:config[a5H],title:config[I3j] || editor[M5H][U5H][N6w]});}}});_buttons[Z6j]=$[c3w]({},_buttons[J5H]);_buttons[Z6j][o5H]=u5H;_buttons[Q5H]=$[W5H]({},_buttons[Y5H]);_buttons[H6j][n5H]=c5H;})();Editor[D6w]={};Editor[Z7H]=function(input,opts){var V6j="r\"></div>";var H2j='-title">';var K6j="v class=";var h2j='-label">';var i6j="previ";var G2j='-title';var g2j=/[Hhm]|LT|LTS/;var l6j="_constru";var w6j="iv ";var F6j="YYYY-";var k2j='-calendar';var E6j="-erro";var e6j="-ico";var X6j="nRight\"";var q6j="xOf";var L6j="rma";var z6j="MM-";var q2j='<span></span>';var O2j='-hours"></div>';var W6j="DD'";var S6j="-second";var r2j=/[YMD]|L(?!T)|l/;var Y6j=" can be used";var v2j='<button>';var M6j="teT";var d2j="_instance";var D6j="cale";var B6j="utton>";var a6j="DD";var h6j="atch";var l2j='-iconLeft">';var m2j='-month"></select>';var D2j='</button>';var Q6j="atetime: Without momentjs only the format 'YYYY-MM-";var R6j="-cal";var p6j="ate\">";var V2j=/[haA]/;var t6j="s\"></d";var L2j='<select class="';var P6j="<div c";var T6j="ar\"></se";var x6j="ateTime";var f6j="e\">";var b6j="<select clas";var x2j='-minutes"></div>';var j6j="-d";var A6j="-tim";var u6j="Editor d";var v6j="cto";var G6j="tor-d";var k6j="ateime-";var N6j="nda";var c7H=l6j;c7H+=v6j;c7H+=z9w;var n7H=D6j;n7H+=o5w;n7H+=N0w;n7H+=z9w;var Y7H=E1aa[540234];Y7H+=U8w;var W7H=i9w;W7H+=y9w;W7H+=D5b;W7H+=H9w;var Q7H=q7w;Q7H+=L0w;var u7H=H9w;u7H+=G5w;u7H+=z9w;var o7H=S9n;o7H+=H7b;var J7H=E1aa[540234];J7H+=D4w;J7H+=L0w;var U7H=S9n;U7H+=t9n;U7H+=E1aa[540234];var M7H=E1aa[540234];M7H+=D4w;M7H+=L0w;var a7H=L0w;a7H+=h6j;var z7H=y9w;z7H+=o5w;z7H+=H9w;z7H+=q6j;var F7H=H0w;F7H+=L6j;F7H+=i9w;var p7H=L0w;p7H+=y1w;p7H+=I0w;var j7H=V5w;j7H+=D4w;j7H+=m6j;var B7H=H0w;B7H+=z9w;B7H+=O6j;var i7H=m9w;i7H+=x6j;var I7H=g4b;I7H+=G6j;I7H+=k6j;var X7H=d6j;X7H+=H9w;X7H+=F7b;X7H+=z1w;var e7H=c2l;e7H+=o5w;var b7H=r6j;b7H+=g6j;var s7H=c2l;s7H+=o5w;var T7H=d6j;T7H+=E1aa[540234];T7H+=y1w;T7H+=H9w;var C7H=E1aa[540234];C7H+=D4w;C7H+=L0w;var N7H=R3w;N7H+=z3w;N7H+=W8w;var R7H=E6j;R7H+=V6j;var w7H=o8w;w7H+=R6n;w7H+=N3w;var y7H=S6j;y7H+=t6j;y7H+=r8b;var f7H=U5n;f7H+=K6j;f7H+=x8w;var A7H=P6j;A7H+=y0w;A7H+=L3w;var P7H=A6j;P7H+=f6j;var K7H=y6j;K7H+=w6j;K7H+=X3w;K7H+=L3w;var t7H=o8w;t7H+=Y8w;t7H+=W8w;var S7H=R6j;S7H+=H9w;S7H+=N6j;S7H+=V6j;var V7H=t1n;V7H+=r8b;var E7H=d6j;E7H+=C6j;E7H+=T6j;E7H+=s6j;var g7H=b6j;g7H+=f3w;var r7H=w9w;r7H+=e1w;r7H+=i9w;var d7H=e6j;d7H+=X6j;d7H+=W8w;var k7H=R3w;k7H+=N3w;var G7H=A6n;G7H+=H5b;G7H+=i9w;G7H+=I6j;var x7H=i6j;x7H+=D4w;x7H+=W5w;var O7H=o8w;O7H+=y5w;O7H+=B6j;var m7H=j6j;m7H+=p6j;var D7H=F6j;D7H+=z6j;D7H+=a6j;var v7H=z0w;v7H+=N9b;v7H+=i9w;var l7H=y9w;l7H+=v5b;l7H+=T9w;var H7H=V9w;H7H+=M6j;H7H+=y9w;H7H+=x9w;this[f0w]=$[c3w](s8w,{},Editor[H7H][U6j],opts);var classPrefix=this[f0w][J6j];var i18n=this[f0w][l7H];if(!window[o6j] && this[f0w][v7H] !== D7H){var h7H=u6j;h7H+=Q6j;h7H+=W6j;h7H+=Y6j;throw h7H;}var timeBlock=function(type){var n6j="iv class=\"";var c6j='-timeblock">';var L7H=A6n;L7H+=r1b;var q7H=y6j;q7H+=n6j;return q7H + classPrefix + c6j + L7H;};var gap=function(){E1aa.n2x();var Z2j='<span>:</span>';return Z2j;};var structure=$(o6n + classPrefix + K6w + o6n + classPrefix + m7H + o6n + classPrefix + H2j + o6n + classPrefix + l2j + O7H + i18n[x7H] + G7H + k7H + o6n + classPrefix + d7H + v2j + i18n[r7H] + D2j + T6w + o6n + classPrefix + h2j + q2j + L2j + classPrefix + m2j + T6w + o6n + classPrefix + h2j + q2j + g7H + classPrefix + E7H + V7H + T6w + o6n + classPrefix + S7H + t7H + K7H + classPrefix + P7H + o6n + classPrefix + O2j + A7H + classPrefix + x2j + f7H + classPrefix + y7H + w7H + o6n + classPrefix + R7H + N7H);this[C7H]={container:structure,date:structure[v0b](T1b + classPrefix + T7H),title:structure[v0b](T1b + classPrefix + G2j),calendar:structure[v0b](T1b + classPrefix + k2j),time:structure[s7H](T1b + classPrefix + b7H),error:structure[e7H](T1b + classPrefix + X7H),input:$(input)};this[l9w]={d:p6w,display:p6w,minutesRange:p6w,secondsRange:p6w,namespace:I7H + Editor[i7H][d2j]++,parts:{date:this[f0w][B7H][E2b](r2j) !== p6w,time:this[f0w][j7H][p7H](g2j) !== p6w,seconds:this[f0w][F7H][z7H](l8w) !== -q2l,hours12:this[f0w][E2j][a7H](V2j) !== p6w}};this[Q6w][I2w][F1n](this[M7H][S2j])[U7H](this[J7H][t2j])[o7H](this[Q6w][u7H]);this[Q6w][S2j][F1n](this[Q7H][W7H])[F1n](this[Y7H][n7H]);this[c7H]();};$[c3w](Editor[Z8H][H8H],{destroy:function(){var K2j="mpty";var A2j='.editor-datetime';var h8H=E1aa[540234];h8H+=U8w;var D8H=H9w;D8H+=K2j;var v8H=D4w;v8H+=V5w;v8H+=V5w;var l8H=E1aa[540234];E1aa.n2x();l8H+=D4w;l8H+=L0w;this[P2j]();this[l8H][I2w][v8H]()[D8H]();this[h8H][w6w][I5n](A2j);},errorMsg:function(msg){var f2j="erro";var L8H=f2j;L8H+=z9w;var q8H=q7w;q8H+=L0w;var error=this[q8H][L8H];if(msg){var m8H=d5w;m8H+=S8j;m8H+=Z9w;error[m8H](msg);}else {var O8H=H9w;O8H+=L0w;O8H+=l2w;O8H+=x0w;error[O8H]();}},hide:function(){var x8H=e4w;x8H+=d5w;x8H+=y9w;x8H+=h9w;this[x8H]();},max:function(date){var y2j="_optio";var w2j="Title";var k8H=y2j;k8H+=a6n;k8H+=w2j;var G8H=L0w;G8H+=R2j;G8H+=i9w;G8H+=H9w;this[f0w][G8H]=date;this[k8H]();this[N2j]();},min:function(date){var b2j="ionsTi";var r8H=C2j;r8H+=T2j;E1aa.n2x();var d8H=s2j;d8H+=i9w;d8H+=b2j;d8H+=E4n;this[f0w][e2j]=date;this[d8H]();this[r8H]();},owns:function(node){var X2j="ilte";var g8H=V5w;g8H+=X2j;g8H+=z9w;return $(node)[T2w]()[g8H](this[Q6w][I2w])[N8w] > h2l;},val:function(set,write){var Z9c="toString";var Q2j=/(\d{4})\-(\d{2})\-(\d{2})/;var I2j="etTi";var F2j="sV";var a2j="momentStri";var i2j="tT";var j2j="oUtc";var p2j='--now';var u2j="toDate";var z2j="alid";var M2j="forma";var B2j="ring";var Y2j="riteOutpu";var U2j="momen";var c2j="teToUtc";var T8H=e4w;T8H+=l9w;T8H+=I2j;T8H+=x9w;var C8H=v3j;C8H+=H9w;C8H+=i2j;C8H+=q9j;var N8H=w1w;N8H+=l9w;N8H+=d9b;var V8H=x9n;V8H+=B2j;if(set === undefined){return this[l9w][E1aa[540234]];}if(set instanceof Date){var E8H=t4w;E8H+=y1w;E8H+=v8b;E8H+=j2j;this[l9w][E1aa[540234]]=this[E8H](set);}else if(set === p6w || set === H8w){this[l9w][E1aa[540234]]=p6w;}else if(set === p2j){this[l9w][E1aa[540234]]=new Date();}else if(typeof set === V8H){if(window[o6j]){var P8H=y9w;P8H+=F2j;P8H+=z2j;var K8H=a2j;K8H+=C0w;var t8H=M2j;t8H+=i9w;var S8H=U2j;S8H+=i9w;var m=window[S8H][J2j](set,this[f0w][t8H],this[f0w][o2j],this[f0w][K8H]);this[l9w][E1aa[540234]]=m[P8H]()?m[u2j]():p6w;}else {var match=set[E2b](Q2j);this[l9w][E1aa[540234]]=match?new Date(Date[W2j](match[q2l],match[L2l] - q2l,match[m2l])):p6w;}}if(write || write === undefined){if(this[l9w][E1aa[540234]]){var A8H=e4w;A8H+=C1w;A8H+=Y2j;A8H+=i9w;this[A8H]();}else {var w8H=z3w;w8H+=N0w;w8H+=Z9w;var y8H=n2j;y8H+=c9w;y8H+=i9w;var f8H=E1aa[540234];f8H+=D4w;f8H+=L0w;this[f8H][y8H][w8H](set);}}if(!this[l9w][E1aa[540234]]){var R8H=L4j;R8H+=c2j;this[l9w][E1aa[540234]]=this[R8H](new Date());}this[l9w][G9n]=new Date(this[l9w][E1aa[540234]][Z9c]());this[l9w][N8H][H9c](q2l);this[C8H]();this[N2j]();this[T8H]();},_constructor:function(){var M9c="tUT";var G9c='-seconds';var O9c="seconds";var D9c="tionsTi";var S9c='select';var h9c="arts";E1aa.n2x();var l9c="containe";var x9c="mov";var z9c="_writeOutput";var r9c=':visible';var k9c='focus.editor-datetime click.editor-datetime';var P9c="hasClas";var b9c="setUTCFullYear";var v9c="autocompl";var A9c="hasC";var E9c='keyup.editor-datetime';var q9c="classPrefi";var m3H=D4w;m3H+=T9w;var L3H=l9c;L3H+=z9w;var q3H=E1aa[540234];q3H+=D4w;q3H+=L0w;var l3H=D4w;l3H+=T9w;var Q8H=D4w;Q8H+=V5w;Q8H+=V5w;var u8H=v9c;u8H+=K1w;var o8H=s2j;o8H+=D9c;o8H+=D5b;o8H+=H9w;var F8H=n9w;F8H+=h9c;var B8H=E1aa[540234];B8H+=N0w;B8H+=i9w;B8H+=H9w;var i8H=n9w;i8H+=N0w;i8H+=z9w;i8H+=Z0n;var s8H=q9c;s8H+=e1w;var that=this;var classPrefix=this[f0w][s8H];var onChange=function(){var L9c="hang";var I8H=E1aa[540234];I8H+=D4w;I8H+=L0w;var X8H=y9w;X8H+=T9w;X8H+=H9n;var e8H=E1aa[540234];e8H+=D4w;e8H+=L0w;var b8H=T0w;b8H+=V9j;b8H+=L9c;b8H+=H9w;that[f0w][b8H][c2n](that,that[e8H][X8H][s9n](),that[l9w][E1aa[540234]],that[I8H][w6w]);};if(!this[l9w][i8H][B8H]){this[Q6w][S2j][M6w](u9n,V9n);}if(!this[l9w][m9c][t2j]){var p8H=f0w;p8H+=l9w;p8H+=l9w;var j8H=g4n;j8H+=x9w;this[Q6w][j8H][p8H](u9n,V9n);}if(!this[l9w][F8H][O9c]){var J8H=O3b;J8H+=N0w;J8H+=T9w;var U8H=E1aa[540234];U8H+=D4w;U8H+=L0w;var M8H=x3w;M8H+=x9c;M8H+=H9w;var a8H=U0b;a8H+=k1b;var z8H=i9w;z8H+=y9w;z8H+=L0w;z8H+=H9w;this[Q6w][z8H][p1n](a8H + classPrefix + G9c)[M8H]();this[U8H][t2j][p1n](J8H)[X4b](q2l)[f0n]();}this[o8H]();this[Q6w][w6w][b5b](u8H,Q8H)[T0w](k9c,function(){E1aa.W2x();var g9c=':disabled';var H3H=H7n;H3H+=I1n;var Z3H=z3w;Z3H+=N0w;Z3H+=Z9w;var c8H=y9w;c8H+=F6w;c8H+=c9w;c8H+=i9w;var n8H=z3w;n8H+=N0w;n8H+=Z9w;var Y8H=y9w;Y8H+=d9c;Y8H+=i9w;var W8H=l9c;W8H+=z9w;if(that[Q6w][W8H][y1n](r9c) || that[Q6w][Y8H][y1n](g9c)){return;}that[n8H](that[Q6w][c8H][Z3H](),R8w);that[H3H]();})[l3H](E9c,function(){var V9c="ntai";var v3H=s8n;E1aa.n2x();v3H+=V9c;v3H+=p2w;if(that[Q6w][v3H][y1n](r9c)){var h3H=q7w;h3H+=L0w;var D3H=n4w;D3H+=Z9w;that[D3H](that[h3H][w6w][s9n](),R8w);}});this[q3H][L3H][m3H](z9b,S9c,function(){var s9c="_setTit";var w9c="ectMo";var K9c="-minut";var T9c="Calande";var i9c="hours12";var t9c="osition";var I9c="rts";var a9c="_setTi";var X9c='-ampm';var B9c="-h";var U9c="Minutes";var e9c='-hours';var F9c="_setTime";var C9c='-year';var f9c="-mo";var N9c="_setTitle";var j9c="ours";var C3H=e4w;C3H+=n9w;C3H+=t9c;var N3H=V5w;N3H+=v9n;N3H+=c9w;N3H+=l9w;var y3H=K9c;y3H+=R0w;var f3H=P9c;f3H+=l9w;var G3H=A9c;G3H+=B2w;var O3H=f9c;O3H+=T9w;O3H+=Y7n;var select=$(this);var val=select[s9n]();if(select[n2w](classPrefix + O3H)){var x3H=y9c;x3H+=F7b;x3H+=w9c;x3H+=R9c;that[x3H](that[l9w][G9n],val);that[N9c]();that[N2j]();}else if(select[G3H](classPrefix + C9c)){var r3H=e4w;r3H+=H7w;r3H+=T9c;r3H+=z9w;var d3H=s9c;d3H+=b5w;var k3H=E1aa[540234];k3H+=T5w;that[l9w][k3H][b9c](val);that[d3H]();that[r3H]();}else if(select[n2w](classPrefix + e9c) || select[n2w](classPrefix + X9c)){var g3H=n9w;g3H+=N0w;g3H+=I9c;if(that[l9w][g3H][i9c]){var A3H=n9w;A3H+=L0w;var P3H=z3w;P3H+=N0w;P3H+=Z9w;var K3H=l9c;K3H+=z9w;var t3H=z3w;t3H+=N0w;t3H+=Z9w;var S3H=B9c;S3H+=j9c;var V3H=V5w;V3H+=t0w;V3H+=E1aa[540234];var E3H=E1aa[540234];E3H+=D4w;E3H+=L0w;var hours=$(that[E3H][I2w])[V3H](T1b + classPrefix + S3H)[t3H]() * q2l;var pm=$(that[Q6w][K3H])[v0b](T1b + classPrefix + X9c)[P3H]() === A3H;that[l9w][E1aa[540234]][p9c](hours === g2l && !pm?h2l:pm && hours !== g2l?hours + g2l:hours);}else {that[l9w][E1aa[540234]][p9c](val);}that[F9c]();that[z9c](s8w);onChange();}else if(select[f3H](classPrefix + y3H)){var R3H=a9c;R3H+=x9w;var w3H=y4w;w3H+=M9c;w3H+=V9j;w3H+=U9c;that[l9w][E1aa[540234]][w3H](val);that[R3H]();that[z9c](s8w);onChange();}else if(select[n2w](classPrefix + G9c)){that[l9w][E1aa[540234]][J9c](val);that[F9c]();that[z9c](s8w);onChange();}that[Q6w][w6w][N3H]();that[C3H]();})[T0w](i1b,function(e){var G0c="_c";var R0c="_set";var D0c='-iconLeft';var J0c="_dateToUtc";var t0c="tes";var Q9c="werCase";var g0c="CHour";var I0c="Hours";var x0c="tTitle";var M0c="mont";var l0c="im";var o9c="ton";var N0c="eco";var c9c="toLo";var X0c="tUTC";var q0c="UTCM";var e0c="TCHours";var w0c="esRang";var h0c="etTitl";var Z0c="erCas";var L0c="onth";var u9c="oLo";var U0c="CDate";var F0c="eOut";var Y9c="ntNo";var p0c="_writ";var f0c="minutesRang";var k0c="orrect";var r0c="etUT";var a0c="TCDat";var W9c="nodeN";var d0c="etT";var j0c='setSeconds';var V0c="conds";var y0c="nut";var C0c="ndsRang";var E0c="hour";var b0c="getU";var A0c="_setT";var n9c="tar";var B0c='setUTCMinutes';var v0c="asC";var u0c='day';var B3H=H5b;B3H+=o9c;var i3H=i9w;i3H+=u9c;i3H+=Q9c;var I3H=W9c;I3H+=Y5b;var X3H=a4w;X3H+=x3w;X3H+=Y9c;X3H+=h9w;var e3H=n9c;e3H+=E5w;e3H+=i9w;var b3H=l9w;b3H+=n9w;b3H+=N0w;b3H+=T9w;var s3H=c9c;s3H+=C1w;s3H+=Z0c;s3H+=H9w;var T3H=p4n;T3H+=K9n;var d=that[l9w][E1aa[540234]];var nodeName=e[T3H][F5j][s3H]();var target=nodeName === b3H?e[e3H][X3H]:e[a1b];nodeName=target[I3H][i3H]();if(nodeName === S9c){return;}e[H0c]();if(nodeName === B3H){var H6H=Z9w;H6H+=x2n;var Z6H=r6j;Z6H+=l0c;Z6H+=H9w;var c3H=n9w;c3H+=l1j;c3H+=t0j;var a3H=A9c;a3H+=y0w;a3H+=l9w;a3H+=l9w;var z3H=A7n;z3H+=T9w;z3H+=K0w;z3H+=H9w;var F3H=d5w;F3H+=v0c;F3H+=B2w;var p3H=N5w;p3H+=q8b;p3H+=B0w;var j3H=a4w;j3H+=x3w;j3H+=k0w;var button=$(target);var parent=button[j3H]();if(parent[n2w](p3H) && !parent[F3H](z3H)){button[M3n]();return;}if(parent[a3H](classPrefix + D0c)){var Q3H=V5w;Q3H+=v9n;Q3H+=c9w;Q3H+=l9w;var u3H=E1aa[540234];u3H+=D4w;u3H+=L0w;var o3H=e4w;o3H+=l9w;o3H+=h0c;o3H+=H9w;var J3H=c5n;J3H+=Z9w;J3H+=E9n;var U3H=H7w;U3H+=q0c;U3H+=L0c;var M3H=E1aa[540234];M3H+=T5w;that[l9w][M3H][U3H](that[l9w][J3H][m0c]() - q2l);that[o3H]();that[N2j]();that[u3H][w6w][Q3H]();}else if(parent[n2w](classPrefix + O0c)){var n3H=e4w;n3H+=l9w;n3H+=H9w;n3H+=x0c;var Y3H=E1aa[540234];Y3H+=y1n;Y3H+=d9b;var W3H=G0c;W3H+=k0c;W3H+=U0w;W3H+=L0c;that[W3H](that[l9w][G9n],that[l9w][Y3H][m0c]() + q2l);that[n3H]();that[N2j]();that[Q6w][w6w][D2w]();}else if(button[c3H](T1b + classPrefix + Z6H)[H6H]){var t6H=e4w;t6H+=l9w;t6H+=d0c;t6H+=g6j;var S6H=l9w;S6H+=r0c;S6H+=g0c;S6H+=l9w;var V6H=E0c;V6H+=l9w;var r6H=N0w;r6H+=L0w;var O6H=l9w;O6H+=H9w;O6H+=V0c;var v6H=L0w;v6H+=S0c;v6H+=t0c;var l6H=c9w;l6H+=T9w;l6H+=y9w;l6H+=i9w;var val=button[m6w](K0c);var unit=button[m6w](l6H);if(unit === v6H){var h6H=A7n;h6H+=T9w;h6H+=E5w;var D6H=P9c;D6H+=l9w;if(parent[D6H](P0c) && parent[n2w](h6H)){var L6H=A0c;L6H+=y9w;L6H+=x9w;var q6H=f0c;q6H+=H9w;that[l9w][q6H]=val;that[L6H]();return;}else {var m6H=s3j;m6H+=y0c;m6H+=w0c;m6H+=H9w;that[l9w][m6H]=p6w;}}if(unit === O6H){var G6H=z9w;G6H+=i0w;G6H+=E5w;var x6H=P9c;x6H+=l9w;if(parent[n2w](P0c) && parent[x6H](G6H)){var d6H=R0c;d6H+=o0w;d6H+=g6j;var k6H=l9w;k6H+=N0c;k6H+=C0c;k6H+=H9w;that[l9w][k6H]=val;that[d6H]();return;}else {that[l9w][T0c]=p6w;}}if(val === r6H){if(d[s0c]() >= g2l){var g6H=b0c;g6H+=e0c;val=d[g6H]() - g2l;}else {return;}}else if(val === H5j){var E6H=E5w;E6H+=X0c;E6H+=I0c;if(d[E6H]() < g2l){val=d[s0c]() + g2l;}else {return;}}var set=unit === V6H?S6H:unit === i0c?B0c:j0c;d[set](val);that[t6H]();that[z9c](s8w);onChange();}else {var R6H=p0c;R6H+=F0c;R6H+=H9n;var w6H=v9w;w6H+=t0n;var y6H=l9w;y6H+=z0c;y6H+=a0c;y6H+=H9w;var f6H=M0c;f6H+=d5w;var A6H=x0w;A6H+=G0b;var P6H=E1aa[540234];P6H+=y1w;P6H+=N0w;var K6H=l9w;K6H+=H9w;K6H+=M9c;K6H+=U0c;if(!d){d=that[J0c](new Date());}d[K6H](q2l);d[b9c](button[P6H](A6H));d[o0c](button[m6w](f6H));d[y6H](button[w6H](u0c));that[R6H](s8w);if(!that[l9w][m9c][t2j]){setTimeout(function(){var Q0c="_hi";var N6H=Q0c;N6H+=E1aa[540234];N6H+=H9w;that[N6H]();},d2l);}else {var C6H=C2j;C6H+=T2j;that[C6H]();}onChange();}}else {that[Q6w][w6w][D2w]();}});},_compareDates:function(a,b){var W0c="_dateToUt";E1aa.n2x();var n0c="trin";var c0c="_dateToUtcString";var Y0c="cS";var T6H=W0c;T6H+=Y0c;T6H+=n0c;T6H+=K0w;return this[T6H](a) === this[c0c](b);},_correctMonth:function(date,month){var H1c="getUTCFul";var v1c="daysInMo";E1aa.n2x();var l1c="lYe";var e6H=E5w;e6H+=i9w;e6H+=Z1c;var b6H=H1c;b6H+=l1c;b6H+=O9b;var s6H=e4w;s6H+=v1c;s6H+=R9c;var days=this[s6H](date[b6H](),month);var correctDays=date[e6H]() > days;date[o0c](month);if(correctDays){date[H9c](days);date[o0c](month);}},_daysInMonth:function(year,month){var R2l=30;var w2l=29;var N2l=31;var y2l=28;var isLeap=year % O2l === h2l && (year % I2l !== h2l || year % B2l === h2l);E1aa.W2x();var months=[N2l,isLeap?w2l:y2l,N2l,R2l,N2l,R2l,N2l,N2l,R2l,N2l,R2l,N2l];return months[month];},_dateToUtc:function(s){var h1c="getMinut";var G1c="getDate";var D1c="Seconds";var O1c="getFull";var m1c="tMon";var q1c="tH";var j6H=E5w;j6H+=i9w;j6H+=D1c;var B6H=h1c;B6H+=R0w;var i6H=E5w;i6H+=q1c;i6H+=D4w;i6H+=L1c;var I6H=K0w;I6H+=H9w;I6H+=m1c;I6H+=Y7n;var X6H=O1c;X6H+=x1c;X6H+=H9w;X6H+=O9b;return new Date(Date[W2j](s[X6H](),s[I6H](),s[G1c](),s[i6H](),s[B6H](),s[j6H]()));},_dateToUtcString:function(d){var k1c="_pa";var d1c="getUTCF";var a6H=P0n;a6H+=Z1c;var z6H=k1c;z6H+=E1aa[540234];var F6H=p6n;F6H+=Q5w;var p6H=d1c;p6H+=r1c;return d[p6H]() + P4b + this[F6H](d[m0c]() + q2l) + P4b + this[z6H](d[a6H]());},_hide:function(){var P1c='div.dataTables_scrollBody';var E1c="keydo";var t1c="ames";var g1c="ck.";var V1c="wn.";var K1c="pace";var S1c="ntainer";var Y6H=k6n;Y6H+=g1c;var W6H=D4w;W6H+=V5w;W6H+=V5w;var Q6H=D4w;Q6H+=A7w;var u6H=E1c;u6H+=V1c;var o6H=D4w;o6H+=V5w;o6H+=V5w;var J6H=E1aa[540234];J6H+=K9n;J6H+=N0w;J6H+=I0w;var U6H=s8n;E1aa.W2x();U6H+=S1c;var M6H=T9w;M6H+=t1c;M6H+=K1c;var namespace=this[l9w][M6H];this[Q6w][U6H][J6H]();$(window)[o6H](T1b + namespace);$(document)[I5n](u6H + namespace);$(P1c)[Q6H](A1c + namespace);$(E5n)[W6H](A1c + namespace);$(A4n)[I5n](Y6H + namespace);},_hours24To12:function(val){return val === h2l?g2l:val > g2l?val - g2l:val;},_htmlDay:function(day){var I1c="<td";var U1c="year";var C1c="a-month=\"";var s1c="-but";var J1c='" data-day="';var e1c="day";var y1c="</s";var M1c='data-year="';var i1c=" class=\"emp";var j1c="sabl";var z1c='" class="';var B1c="ty\"></td>";var F1c='<td data-day="';var b1c="ton ";var p1c='now';var w1c="pan>";var T1c="-day\" type=\"button";var g2H=f1c;g2H+=k5w;g2H+=T9w;g2H+=W8w;var r2H=y1c;r2H+=w1c;var d2H=E1aa[540234];d2H+=N0w;d2H+=x0w;var k2H=o8w;k2H+=l9w;k2H+=a4w;k2H+=R1c;var G2H=x8w;G2H+=W8w;var x2H=L0w;x2H+=T0w;x2H+=i9w;x2H+=d5w;var O2H=N1c;O2H+=C1c;var m2H=T1c;m2H+=x8w;m2H+=W7w;var L2H=s1c;L2H+=b1c;var h2H=y4w;h2H+=Z9w;h2H+=T8w;h2H+=B0w;var v2H=k5w;v2H+=e1c;var Z2H=l9w;Z2H+=X1c;Z2H+=C0w;Z2H+=s2w;var n6H=H9w;n6H+=L0w;n6H+=n9w;n6H+=B3w;if(day[n6H]){var c6H=I1c;c6H+=i1c;c6H+=B1c;return c6H;}var classes=[Z2H];var classPrefix=this[f0w][J6j];if(day[f2w]){var l2H=w1w;l2H+=j1c;l2H+=H9w;l2H+=E1aa[540234];var H2H=n9w;H2H+=c9w;H2H+=P8w;classes[H2H](l2H);}if(day[v2H]){var D2H=K8w;D2H+=l9w;D2H+=d5w;classes[D2H](p1c);}if(day[h2H]){var q2H=K8w;q2H+=l9w;q2H+=d5w;classes[q2H](a3j);}return F1c + day[e1c] + z1c + classes[F3b](E6w) + K6w + a1c + classPrefix + L2H + classPrefix + m2H + M1c + day[U1c] + O2H + day[x2H] + J1c + day[e1c] + G2H + k2H + day[d2H] + r2H + g2H + o1c;},_htmlMonth:function(year,month){var N4c="kNumbe";var W1c="dy>";var u1c="e>";var G4c="TCHo";var Y1c="joi";var D4c="Pre";var K2l=23;var E4c="pareD";var h4c="ix";var H4c="_html";var Q1c="</tb";var t4c="_htmlDay";var m4c="getUTCDay";var g4c="ableDays";var A4c="showWeekNumber";var q4c="aysInMonth";var f4c="Week";var C4c="-i";var R4c="ee";var S4c="_compareDates";var w4c=" w";var e4c='<thead>';var O4c="firstDay";var r4c="nArra";var P4c="r>";var T4c="conL";var b4c='<table class="';var c1c="</t";var L4c="eToUtc";var Z4c="ead>";E1aa.W2x();var x4c="maxDate";var k4c="setUTCMinutes";var V4c="ates";var n1c="tbody>";var l4c="MonthHead";var d4c="setS";var y4c="OfYear";var v4c="class";var o2H=o8w;o2H+=y3w;o2H+=H1j;o2H+=u1c;var J2H=Q1c;J2H+=D4w;J2H+=W1c;var U2H=Y1c;U2H+=T9w;var M2H=o8w;M2H+=n1c;var a2H=c1c;a2H+=d5w;a2H+=Z4c;var z2H=H4c;z2H+=l4c;var s2H=d6j;s2H+=i9w;s2H+=q8b;s2H+=H9w;var T2H=v4c;T2H+=D4c;T2H+=V5w;T2H+=h4c;var V2H=t4w;V2H+=q4c;var E2H=d4j;E2H+=L4c;var now=this[E2H](new Date()),days=this[V2H](year,month),before=new Date(Date[W2j](year,month,q2l))[m4c](),data=[],row=[];if(this[f0w][O4c] > h2l){before-=this[f0w][O4c];if(before < h2l){before+=G2l;}}var cells=days + before,after=cells;while(after > G2l){after-=G2l;}cells+=G2l - after;var minDate=this[f0w][e2j];var maxDate=this[f0w][x4c];if(minDate){var S2H=l9w;S2H+=z0c;S2H+=G4c;S2H+=L1c;minDate[S2H](h2l);minDate[k4c](h2l);minDate[J9c](h2l);}if(maxDate){var t2H=d4c;t2H+=U7w;t2H+=T0w;t2H+=K5w;maxDate[p9c](K2l);maxDate[k4c](e2l);maxDate[t2H](e2l);}for(var i=h2l,r=h2l;i < cells;i++){var y2H=y9w;y2H+=r4c;y2H+=x0w;var f2H=Q6b;f2H+=j1w;var A2H=E1aa[540234];A2H+=y1n;A2H+=g4c;var P2H=y9c;P2H+=L0w;P2H+=E4c;P2H+=V4c;var K2H=V1j;K2H+=o0w;K2H+=V9j;var day=new Date(Date[K2H](year,month,q2l + (i - before))),selected=this[l9w][E1aa[540234]]?this[S4c](day,this[l9w][E1aa[540234]]):R8w,today=this[P2H](day,now),empty=i < before || i >= days + before,disabled=minDate && day < minDate || maxDate && day > maxDate;var disableDays=this[f0w][A2H];if(Array[f2H](disableDays) && $[y2H](day[m4c](),disableDays) !== -q2l){disabled=s8w;}else if(typeof disableDays === E1aa[363362] && disableDays(day) === s8w){disabled=s8w;}var dayConfig={day:q2l + (i - before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[F9n](this[t4c](dayConfig));if(++r === G2l){var C2H=o8w;C2H+=K4c;C2H+=P4c;var N2H=o8w;N2H+=i9w;N2H+=P4c;var R2H=n9w;R2H+=Z2b;if(this[f0w][A4c]){var w2H=H4c;w2H+=f4c;w2H+=y4c;row[d2w](this[w2H](i - before,month,year));}data[R2H](N2H + row[F3b](H8w) + C2H);row=[];r=h2l;}}var classPrefix=this[f0w][T2H];var className=classPrefix + s2H;if(this[f0w][A4c]){var b2H=w4c;b2H+=R4c;b2H+=N4c;b2H+=z9w;className+=b2H;}if(minDate){var B2H=U9n;B2H+=w9w;var i2H=E1aa[540234];i2H+=w5w;i2H+=E9n;var I2H=C4c;I2H+=T4c;I2H+=H9w;I2H+=E2n;var X2H=s4c;X2H+=E1aa[540234];var e2H=E1aa[540234];e2H+=D4w;e2H+=L0w;var underMin=minDate >= new Date(Date[W2j](year,month,q2l,h2l,h2l,h2l));this[e2H][N6w][X2H](e1b + classPrefix + I2H)[M6w](i2H,underMin?B2H:Q9n);}if(maxDate){var F2H=a5w;F2H+=v9n;F2H+=V7w;var p2H=T9w;p2H+=D4w;p2H+=T9w;p2H+=H9w;var j2H=c5n;j2H+=Z9w;j2H+=E9n;var overMax=maxDate < new Date(Date[W2j](year,month + q2l,q2l,h2l,h2l,h2l));this[Q6w][N6w][v0b](e1b + classPrefix + O0c)[M6w](j2H,overMax?p2H:F2H);}return b4c + className + K6w + e4c + this[z2H]() + a2H + M2H + data[U2H](H8w) + J2H + o2H;},_htmlMonthHead:function(){var p4c="h>";var I4c="firstDa";var B4c='<th></th>';var X4c="showWeekNum";var Z9l=C8w;Z9l+=y6n;var W2H=X4c;W2H+=c0w;var Q2H=y9w;Q2H+=v5b;Q2H+=T9w;var u2H=I4c;u2H+=x0w;var a=[];var firstDay=this[f0w][u2H];E1aa.n2x();var i18n=this[f0w][Q2H];var dayName=function(day){var i4c="weekdays";day+=firstDay;E1aa.n2x();while(day >= G2l){day-=G2l;}return i18n[i4c][day];};if(this[f0w][W2H]){a[F9n](B4c);}for(var i=h2l;i < G2l;i++){var c2H=o8w;c2H+=y3w;c2H+=Y7n;c2H+=W8w;var n2H=j4c;n2H+=p4c;var Y2H=n9w;Y2H+=c9w;Y2H+=P8w;a[Y2H](n2H + dayName(i) + c2H);}return a[Z9l](H8w);},_htmlWeekOfYear:function(d,m,y){var M4c="getDay";var F4c="-we";var U4c='<td class="';var z4c="ek\">";var U2l=86400000;var l9l=F4c;l9l+=z4c;var H9l=P0n;H9l+=m9w;H9l+=y1w;H9l+=H9w;var date=new Date(y,m,d,h2l,h2l,h2l,h2l);date[a4c](date[H9l]() + O2l - (date[M4c]() || G2l));var oneJan=new Date(y,h2l,q2l);var weekNum=Math[T7w](((date - oneJan) / U2l + q2l) / G2l);return U4c + this[f0w][J6j] + l9l + weekNum + o1c;},_options:function(selector,values,labels){var o4c="ssPr";var Y4c="tion>";var Q4c='select.';var J4c="empt";var c4c="ion value=\"";var n4c="<opt";var W4c="</op";var u4c="efix";var h9l=Z9w;h9l+=x2n;var D9l=J4c;D9l+=x0w;var v9l=f0w;v9l+=y0w;v9l+=o4c;v9l+=u4c;if(!labels){labels=values;}var select=this[Q6w][I2w][v0b](Q4c + this[f0w][v9l] + P4b + selector);select[D9l]();for(var i=h2l,ien=values[h9l];i < ien;i++){var L9l=W4c;L9l+=Y4c;var q9l=n4c;q9l+=c4c;select[F1n](q9l + values[i] + K6w + labels[i] + L9l);}},_optionSet:function(selector,val){var D5c="ect.";var Z5c="kn";var q5c='span';var h5c="nta";var E9l=Y0w;E9l+=Z5c;E9l+=J1n;var g9l=y9w;g9l+=Y3w;g9l+=X2n;var r9l=i9w;r9l+=z2n;r9l+=i9w;var d9l=U7j;d9l+=d5w;var k9l=H5c;k9l+=l5c;var G9l=z3w;G9l+=N0w;G9l+=Z9w;var x9l=v5c;x9l+=D5c;var O9l=c2l;O9l+=T9w;O9l+=E1aa[540234];var m9l=s8n;m9l+=h5c;m9l+=M0b;m9l+=z9w;var select=this[Q6w][m9l][O9l](x9l + this[f0w][J6j] + P4b + selector);var span=select[B0n]()[p1n](q5c);select[G9l](val);var selected=select[v0b](k9l);span[P9n](selected[d9l] !== h2l?selected[r9l]():this[f0w][g9l][E9l]);},_optionsTime:function(unit,count,val,allowed,range){var F5c="head><tab";var L5c="</th";var B5c="body>";var e5c='<tr>';var U5c='</tbody>';var G5c="le class=\"";var I5c="amPm";var g5c="efi";var E5c="_pad";var O5c="></thead>";var X5c='</tr>';var d5c="clas";var x5c="<tab";var a5c='<thead><tr><th colspan="';var r5c="sPr";var b5c="amP";var m5c="></";var s5c="tr>";var p5c="></t";var J5c='</table>';var z5c="floor";var V5c='-table';var j5c="</tbody";var i5c="-nospace\"><";var M5c='<tbody>';var x2l=6;var k5c="emp";var u9l=L5c;u9l+=m5c;u9l+=e5w;u9l+=O5c;var o9l=x8w;o9l+=W8w;var J9l=x5c;J9l+=G5c;var U9l=P4n;U9l+=o5w;var M9l=k5c;M9l+=i9w;M9l+=x0w;var K9l=i3j;K9l+=T9w;var t9l=E1aa[540234];t9l+=y9w;t9l+=z3w;t9l+=k1b;var S9l=E1aa[540234];S9l+=D4w;S9l+=L0w;var V9l=d5c;V9l+=r5c;V9l+=g5c;V9l+=e1w;var classPrefix=this[f0w][V9l];var container=this[S9l][I2w][v0b](t9l + classPrefix + P4b + unit);var i,j;var render=count === g2l?function(i){E1aa.n2x();return i;}:this[E5c];var classPrefix=this[f0w][J6j];var className=classPrefix + V5c;var i18n=this[f0w][K9l];if(!container[N8w]){return;}var a=H8w;var span=d2l;var button=function(value,label,className){var A5c="e=\"button\" data-uni";var K5c="a-value=\"";E1aa.W2x();var f5c="t=\"";var w5c="n ";var P5c="-day\" t";var N5c="numb";var y5c="-butt";var t5c="<span";var T5c='<td class="selectable ';var C5c=' disabled';var R5c="ted";var S5c="span>";var X9l=f1c;X9l+=k5w;X9l+=T9w;X9l+=W8w;var e9l=o8w;e9l+=y3w;e9l+=S5c;var b9l=t5c;b9l+=W8w;var s9l=x8w;s9l+=W8w;var T9l=N1c;T9l+=K5c;var C9l=P5c;C9l+=p4w;C9l+=A5c;C9l+=f5c;var N9l=y5c;N9l+=D4w;N9l+=w5c;var R9l=x8w;R9l+=W8w;var w9l=l2b;w9l+=F7b;w9l+=N0w;w9l+=x0w;var y9l=v5c;y9l+=U7w;y9l+=R5c;var f9l=n9w;f9l+=L0w;var A9l=N0w;A9l+=L0w;var P9l=N5c;P9l+=H1w;if(count === g2l && typeof value === P9l){if(val >= g2l){value+=g2l;}if(value == g2l){value=h2l;}else if(value == P2l){value=g2l;}}var selected=val === value || value === A9l && val < g2l || value === f9l && val >= g2l?y9l:H8w;if(allowed && $[w9l](value,allowed) === -q2l){selected+=C5c;}if(className){selected+=E6w + className;}return T5c + selected + R9l + a1c + classPrefix + N9l + classPrefix + C9l + unit + T9l + value + s9l + b9l + label + e9l + X9l + o1c;};if(count === g2l){var j9l=o8w;j9l+=y3w;j9l+=s5c;var B9l=n9w;B9l+=L0w;var i9l=j4c;i9l+=z9w;i9l+=W8w;var I9l=b5c;I9l+=L0w;a+=e5c;for(i=q2l;i <= x2l;i++){a+=button(i,render(i));}a+=button(Z5j,i18n[I9l][h2l]);a+=X5c;a+=i9l;for(i=G2l;i <= g2l;i++){a+=button(i,render(i));}a+=button(B9l,i18n[I5c][q2l]);a+=j9l;span=G2l;}else if(count === P2l){var c=h2l;for(j=h2l;j < O2l;j++){a+=e5c;for(i=h2l;i < x2l;i++){a+=button(c,render(c));c++;}a+=X5c;}span=x2l;}else {var a9l=i5c;a9l+=i9w;a9l+=B5c;var z9l=j5c;z9l+=p5c;z9l+=F5c;z9l+=G5c;var F9l=o8w;F9l+=K4c;F9l+=z9w;F9l+=W8w;a+=e5c;for(j=h2l;j < X2l;j+=d2l){var p9l=A7n;p9l+=T9w;p9l+=E5w;a+=button(j,render(j),p9l);}a+=F9l;a+=z9l + className + E6w + className + a9l;var start=range !== p6w?range:Math[z5c](val / d2l) * d2l;a+=e5c;for(j=start + q2l;j < start + d2l;j++){a+=button(j,render(j));}a+=X5c;span=x2l;}container[M9l]()[U9l](J9l + className + o9l + a5c + span + K6w + i18n[unit] + u9l + M5c + a + U5c + J5c);},_optionsTitle:function(){var h7c="months";var Z7c="getFullYear";var c5c="nDate";var Q5c="ange";var v7c='month';var u5c="rR";var Y5c="Ful";var H7c="yearRange";var o5c="yea";var l7c="_options";var W5c="getF";var n5c="lY";var H0l=o5c;H0l+=z9w;var Z0l=C6j;Z0l+=N0w;Z0l+=u5c;Z0l+=Q5c;var c9l=W5c;c9l+=r1c;var n9l=P0n;n9l+=Y5c;n9l+=n5c;n9l+=G0b;var Y9l=L0w;Y9l+=R2j;Y9l+=i9w;Y9l+=H9w;var W9l=s3j;W9l+=c5c;var Q9l=y9w;Q9l+=v5b;Q9l+=T9w;var i18n=this[f0w][Q9l];var min=this[f0w][W9l];E1aa.n2x();var max=this[f0w][Y9l];var minYear=min?min[Z7c]():p6w;var maxYear=max?max[n9l]():p6w;var i=minYear !== p6w?minYear:new Date()[c9l]() - this[f0w][H7c];var j=maxYear !== p6w?maxYear:new Date()[Z7c]() + this[f0w][Z0l];this[l7c](v7c,this[D7c](h2l,r2l),i18n[h7c]);this[l7c](H0l,this[D7c](i,j));},_pad:function(i){var q7c='0';return i < d2l?q7c + i:i;},_position:function(){var G7c="outerWi";var m7c="scr";var g7c="ight";var r7c="eigh";var V7c="offs";var K7c='top';var k7c="dth";var t7c="emoveCl";var L7c="widt";var S7c='horizontal';var E7c="ainer";var O7c="oll";var x7c="Top";var d7c="terH";var E0l=L7c;E0l+=d5w;var r0l=i9w;r0l+=D4w;r0l+=n9w;var d0l=m7c;d0l+=O7c;d0l+=x7c;var k0l=G7c;k0l+=k7c;var G0l=J5w;G0l+=d7c;G0l+=r7c;G0l+=i9w;var x0l=Z9w;x0l+=H9w;x0l+=V5w;x0l+=i9w;var O0l=i9w;O0l+=h5w;var q0l=a4w;q0l+=z9w;q0l+=i9w;q0l+=l9w;var h0l=w1n;h0l+=H9w;h0l+=Z5n;h0l+=g7c;var D0l=N2w;D0l+=E7c;var v0l=E1aa[540234];v0l+=D4w;v0l+=L0w;var l0l=V7c;l0l+=K9n;var offset=this[Q6w][w6w][l0l]();var container=this[v0l][D0l];var inputHeight=this[Q6w][w6w][h0l]();if(this[l9w][q0l][S2j] && this[l9w][m9c][t2j] && $(window)[f2n]() > p2l){var L0l=N0w;L0l+=P3b;container[L0l](S7c);}else {var m0l=z9w;m0l+=t7c;m0l+=J6b;container[m0l](S7c);}container[M6w]({top:offset[O0l] + inputHeight,left:offset[x0l]})[D9b](A4n);var calHeight=container[G0l]();var calWidth=container[k0l]();var scrollTop=$(window)[d0l]();if(offset[r0l] + inputHeight + calHeight - scrollTop > $(window)[X8n]()){var g0l=u0n;g0l+=l9w;var newTop=offset[x8n] - calHeight;container[g0l](K7c,newTop < h2l?h2l:newTop);}if(calWidth + offset[P2n] > $(window)[E0l]()){var S0l=Z9w;S0l+=q9n;S0l+=i9w;var V0l=f0w;V0l+=l9w;V0l+=l9w;var newLeft=$(window)[f2n]() - calWidth;container[V0l](S0l,newLeft < h2l?h2l:newLeft);}},_range:function(start,end,inc){E1aa.n2x();var a=[];if(!inc){inc=q2l;}for(var i=start;i <= end;i+=inc){a[F9n](i);}return a;},_setCalander:function(){var P7c="getUTCFull";var y7c="calendar";var f7c="mlMonth";var t0l=E1aa[540234];t0l+=y9w;t0l+=O3b;t0l+=C4j;if(this[l9w][t0l]){var A0l=P7c;A0l+=x1c;A0l+=G0b;var P0l=A7c;P0l+=i9w;P0l+=f7c;var K0l=E1aa[540234];K0l+=U8w;this[K0l][y7c][I2n]()[F1n](this[P0l](this[l9w][G9n][A0l](),this[l9w][G9n][m0c]()));}},_setTitle:function(){var w7c="_opti";var R7c="opt";var N7c="ionSet";var R0l=x0w;R0l+=H9w;R0l+=N0w;R0l+=z9w;var w0l=w7c;w0l+=T0w;w0l+=P7j;w0l+=i9w;var y0l=L0w;y0l+=D4w;y0l+=T9w;y0l+=Y7n;var f0l=e4w;f0l+=R7c;f0l+=N7c;this[f0l](y0l,this[l9w][G9n][m0c]());this[w0l](R0l,this[l9w][G9n][C7c]());},_setTime:function(){var X7c="onsTi";var z7c='hours';var I7c="hou";var M7c="getUTCMinutes";var U7c="_optionsTime";var B7c="_optionsTim";var a7c="hoursAvailable";var s7c="getSeco";var J7c='seconds';var e7c="tesRange";var T7c="seco";var b7c="nds";var X0l=T7c;X0l+=T9w;X0l+=K5w;var e0l=s7c;e0l+=b7c;var b0l=L0w;b0l+=S0c;b0l+=e7c;var s0l=s2j;s0l+=g4n;s0l+=X7c;s0l+=x9w;var T0l=I7c;T0l+=i7c;T0l+=Y3w;T0l+=f7w;var C0l=B7c;C0l+=H9w;var that=this;var d=this[l9w][E1aa[540234]];var hours=d?d[s0c]():h2l;var allowed=function(prop){var p7c='Available';E1aa.W2x();var j7c="ailabl";var F7c='Increment';var N0l=v1w;N0l+=z3w;N0l+=j7c;N0l+=H9w;return that[f0w][prop + p7c]?that[f0w][prop + N0l]:that[D7c](h2l,e2l,that[f0w][prop + F7c]);};this[C0l](z7c,this[l9w][m9c][T0l]?g2l:P2l,hours,this[f0w][a7c]);this[s0l](i0c,X2l,d?d[M7c]():h2l,allowed(i0c),this[l9w][b0l]);this[U7c](J7c,X2l,d?d[e0l]():h2l,allowed(X0l),this[l9w][T0c]);},_show:function(){var H8c="ze.";var c7c=" r";var o7c="idth";var Y7c="taTables_scrollBody";var Q7c="_position";var W7c="div.da";var n7c="l.";var l8c="croll.";var h8c='keydown.';var Z8c="si";var u7c="namespace";var J0l=D4w;J0l+=T9w;var I0l=C1w;I0l+=o7c;var that=this;var namespace=this[l9w][u7c];this[Q7c]();if($(window)[I0l]() > z2l){var M0l=D4w;M0l+=T9w;var a0l=W7c;a0l+=Y7c;var F0l=L4n;F0l+=n7c;var p0l=D4w;p0l+=T9w;var B0l=c7c;B0l+=H9w;B0l+=Z8c;B0l+=H8c;var i0l=l9w;i0l+=l8c;$(window)[T0w](i0l + namespace + B0l + namespace,function(){var v8c="_posi";var j0l=v8c;j0l+=Z7w;that[j0l]();});$(E5n)[p0l](F0l + namespace,function(){var D8c="_hid";var z0l=D8c;z0l+=H9w;E1aa.W2x();that[z0l]();});$(a0l)[M0l](A1c + namespace,function(){E1aa.W2x();var U0l=A7c;U0l+=C7j;that[U0l]();});}$(document)[J0l](h8c + namespace,function(e){var q8c="yCode";var k2l=9;var u0l=V7w;u0l+=H9w;u0l+=q8c;var o0l=W2n;o0l+=Y2n;o0l+=Q6n;o0l+=H9w;if(e[o0l] === k2l || e[u0l] === f2l || e[t9j] === E2l){that[P2j]();}});setTimeout(function(){E1aa.W2x();var m8c="k.";var Q0l=f0w;Q0l+=Z9w;Q0l+=L8c;Q0l+=m8c;$(A4n)[T0w](Q0l + namespace,function(e){var O8c="tainer";var H1l=y9w;H1l+=T9w;H1l+=n9w;H1l+=W8n;var Z1l=S0n;Z1l+=O8c;var c0l=E1aa[540234];c0l+=U8w;var n0l=R5b;n0l+=i9w;n0l+=H1w;var Y0l=i3b;Y0l+=q5w;Y0l+=Z0n;var W0l=t0n;W0l+=z9w;W0l+=K0w;W0l+=K9n;var parents=$(e[W0l])[Y0l]();if(!parents[n0l](that[c0l][Z1l])[N8w] && e[a1b] !== that[Q6w][H1l][h2l]){var l1l=A7c;l1l+=r5w;l1l+=H9w;that[l1l]();}});},d2l);},_writeOutput:function(focus){var k8c="ome";var d8c="momentStrict";var r8c="getUTCDate";var x8c="ang";var G8c="oment";var O1l=I0w;O1l+=x8c;O1l+=H9w;var m1l=z3w;m1l+=N0w;m1l+=Z9w;var L1l=e4w;L1l+=n9w;L1l+=N0w;L1l+=E1aa[540234];var q1l=p6n;q1l+=Q5w;var h1l=H0w;h1l+=m6j;var D1l=L0w;D1l+=G8c;var v1l=L0w;v1l+=k8c;v1l+=k0w;var date=this[l9w][E1aa[540234]];var out=window[v1l]?window[D1l][J2j](date,undefined,this[f0w][o2j],this[f0w][d8c])[E2j](this[f0w][h1l]):date[C7c]() + P4b + this[q1l](date[m0c]() + q2l) + P4b + this[L1l](date[r8c]());this[Q6w][w6w][m1l](out)[k3b](O1l,{write:date});if(focus){this[Q6w][w6w][D2w]();}}});Editor[g8c][x1l]=h2l;Editor[G1l][U6j]={classPrefix:E8c,disableDays:p6w,firstDay:q2l,format:V8c,hoursAvailable:p6w,i18n:Editor[k1l][W0n][d1l],maxDate:p6w,minDate:p6w,minutesAvailable:p6w,minutesIncrement:q2l,momentStrict:s8w,momentLocale:S8c,onChange:function(){},secondsAvailable:p6w,secondsIncrement:q2l,showWeekNumber:R8w,yearRange:A2l};(function(){var e3c="_enabled";var r9Z="_pic";var J3c='input';var K6c="_editor_val";var X6c="_lastSet";var s6c="ipOpts";var X3c="oveClass";var K2c="valu";var Y9Z="noFileText";var W3c="hidden";var K8c="dM";var P6c="optionsPair";var f8c="exte";var D2c='<label for="';var Y2c="datepicker";var P8c="datetim";var U6c="change";var Y3c="_val";var o6c="checkbox";var V2c="bled";var r2c="_inp";var F6c="nput";var e6c="_addOptions";var N3c="abled";var i9Z="_picker";var P9Z="_closeFn";var k6c="_in";var R8c="upl";var t8c="uploa";var m6c="_inpu";var u3c="fieldType";var E2c="checked";var A8c="dio";var p6c="separator";var v6c="/>";var y8c="els";var R6c="multipl";var Y6c="l>";var l9Z="picker";var u6c="pairs";var Q3c="_input";var h2c='input:last';var U9Z='postUpload';var H6c="safeId";var Y8c="ple";var v2c='_';var c3c="readonly";var N9Z="wireFormat";var n8c="<i";var l6c='text';var T2c="cked";var B3c="led";var p2c="prop";var n3c="_v";var d6c="placeho";var O6c="textarea";var D6c="password";var m6l=A1n;m6l+=q5w;m6l+=E1aa[540234];var L6l=t8c;L6l+=K8c;L6l+=w7j;var X3l=H9w;X3l+=e1w;X3l+=i9w;X3l+=i5w;var l3l=z2n;l3l+=S9w;l3l+=o5w;var H3l=P8c;H3l+=H9w;var s7l=z2n;s7l+=S9w;s7l+=o5w;var T7l=A7n;T7l+=A8c;var L5l=y4w;L5l+=b5w;L5l+=C0w;var v5l=f8c;v5l+=T9w;v5l+=E1aa[540234];var n4l=H9w;n4l+=e5j;n4l+=E1aa[540234];var U4l=n8j;U4l+=E1aa[540234];var M4l=i9w;M4l+=H9w;M4l+=V4b;var j4l=z2n;j4l+=J4b;j4l+=E1aa[540234];var s4l=L0w;s4l+=Q6n;s4l+=y8c;var T4l=z2n;T4l+=i9w;T4l+=i5w;var r1l=r3n;r1l+=w8c;var fieldTypes=Editor[r1l];function _buttonText(conf,text){var C8c="dText";var N8c="oa";var T8c="Choose file...";var s8c='div.upload button';var V1l=V5w;V1l+=t0w;V1l+=E1aa[540234];var E1l=G9w;E1l+=T9w;E1l+=H9n;if(text === p6w || text === undefined){var g1l=R8c;g1l+=N8c;g1l+=C8c;text=conf[g1l] || T8c;}conf[E1l][V1l](s8c)[P9n](text);}function _commonUpload(editor,conf,dropCallback,multiple){var L3c="onI";var u8c="lue\">";var D3c="u_table\">";var X8c="Fil";var z8c="ss=\"cell\">";var K3c="and drop a file ";var d3c="dra";var U3c='div.clearValue button';var i8c="_enabl";var k3c='input[type=file]';var b3c='over';var Q8c="/i";var I8c="eR";var h3c="<div class=\"editor_uploa";var w3c='drop';var y3c="rop span";var m3c="nternal";var E3c="agexit";var r3c="gleav";var x3c='"></button>';var p8c="ass=";var q3c="d\">";var W8c="nput>";var G3c='<div class="cell limitHide">';var Z3c="file\" ";var H3c="\"></butt";var b8c="dr";var I3c='dragover';var S3c="drop";var e8c="agDrop";var J8c=" second\">";var o8c="<div class=\"cell clearVa";var O3c='<div class="cell upload limitHide">';var F8c="\"rendered\"></div>";var M8c="><span></span></div>";var B8c="<div";var l3c="ass=\"row\">";var j8c=" cl";var a8c="drop\"";var A3c="dragDropT";var V3c="v.";var c8c="t type=\"";var g3c="e dr";var M3c="div.rend";var v3c="div class=\"e";var t3c="Drag ";var P3c="here to upload";var f3c=".d";var U8c="<div class=\"row";var f4l=D4w;f4l+=T9w;var K4l=i4n;K4l+=b8w;var t4l=D4w;t4l+=T9w;var J1l=b8c;J1l+=e8c;var U1l=X8c;U1l+=I8c;U1l+=v3n;U1l+=z9w;var B1l=i8c;B1l+=B0w;var i1l=e4w;i1l+=n2j;i1l+=c9w;i1l+=i9w;var I1l=t1n;I1l+=r8b;var X1l=A6n;X1l+=E1aa[540234];X1l+=r8b;var e1l=B8c;e1l+=j8c;e1l+=p8c;e1l+=F8c;var b1l=p3w;b1l+=N0w;b1l+=z8c;var s1l=A6n;s1l+=r1b;var T1l=i6n;T1l+=m8b;T1l+=a8c;T1l+=M8c;var C1l=U8c;C1l+=J8c;var N1l=R3w;N1l+=N3w;var R1l=o8c;R1l+=u8c;var w1l=W8w;w1l+=o8w;w1l+=Q8c;w1l+=W8c;var y1l=N9n;y1l+=i9w;y1l+=y9w;y1l+=Y8c;var f1l=n8c;f1l+=d9c;f1l+=c8c;f1l+=Z3c;var A1l=H3c;A1l+=I6j;var P1l=p3w;P1l+=l3c;var K1l=o8w;K1l+=v3c;K1l+=D3c;var t1l=h3c;t1l+=q3c;var S1l=x1b;S1l+=L3c;S1l+=m3c;var btnClass=editor[i2w][c6n][S1l];var container=$(t1l + K1l + P1l + O3c + a1c + btnClass + A1l + f1l + (multiple?y1l:H8w) + w1l + T6w + R1l + a1c + btnClass + x3c + T6w + N1l + C1l + G3c + T1l + s1l + b1l + e1l + T6w + X1l + T6w + I1l);conf[i1l]=container;conf[B1l]=s8w;if(conf[r5w]){var z1l=y9w;z1l+=E1aa[540234];var F1l=F4w;F1l+=H9w;F1l+=Z2n;F1l+=E1aa[540234];var p1l=y9w;p1l+=E1aa[540234];var j1l=V5w;j1l+=y9w;j1l+=T9w;j1l+=E1aa[540234];container[j1l](k3c)[b5b](p1l,Editor[F1l](conf[z1l]));}if(conf[b5b]){var M1l=N0w;M1l+=i9w;M1l+=i9w;M1l+=z9w;var a1l=s4c;a1l+=E1aa[540234];container[a1l](k3c)[M1l](conf[b5b]);}_buttonText(conf);if(window[U1l] && conf[J1l] !== R8w){var r4l=l7n;r4l+=l9w;r4l+=H9w;var d4l=D4w;d4l+=T9w;var O4l=D4w;O4l+=r9w;O4l+=T9w;var D4l=d3c;D4l+=r3c;D4l+=g3c;D4l+=E3c;var v4l=D4w;v4l+=T9w;var n1l=D4w;n1l+=T9w;var Y1l=w1w;Y1l+=V3c;Y1l+=S3c;var W1l=t3c;W1l+=K3c;W1l+=P3c;var Q1l=A3c;Q1l+=A1n;var u1l=U0b;u1l+=f3c;u1l+=y3c;var o1l=V5w;o1l+=y9w;o1l+=T9w;o1l+=E1aa[540234];container[o1l](u1l)[m1n](conf[Q1l] || W1l);var dragDrop=container[v0b](Y1l);dragDrop[n1l](w3c,function(e){var R3c="_en";var s3c="dataTransfer";var T3c="originalEve";var C3c="removeC";var c1l=R3c;c1l+=N3c;if(conf[c1l]){var l4l=C3c;l4l+=y0w;l4l+=w0w;var H4l=g8w;H4l+=l9w;var Z4l=T3c;Z4l+=k0w;Editor[X5b](editor,conf,e[Z4l][s3c][H4l],_buttonText,dropCallback);dragDrop[l4l](b3c);}E1aa.n2x();return R8w;})[v4l](D4l,function(e){E1aa.n2x();if(conf[e3c]){var q4l=D4w;q4l+=z3w;q4l+=H1w;var h4l=t3b;h4l+=X3c;dragDrop[h4l](q4l);}return R8w;})[T0w](I3c,function(e){var j3c="addCl";var i3c="_enab";var L4l=i3c;L4l+=B3c;if(conf[L4l]){var m4l=j3c;m4l+=J6b;dragDrop[m4l](b3c);}return R8w;});editor[T0w](O4l,function(){var F3c="ver.DTE_Upload drop.DTE_Uplo";var z3c="ody";var p3c="drago";var k4l=p3c;k4l+=F3c;k4l+=Q5w;var G4l=D4w;G4l+=T9w;var x4l=y5w;x4l+=z3c;$(x4l)[G4l](k4l,function(e){E1aa.n2x();return R8w;});})[d4l](r4l,function(){var a3c='dragover.DTE_Upload drop.DTE_Upload';E1aa.W2x();var g4l=D4w;g4l+=A7w;$(A4n)[g4l](a3c);});}else {var S4l=M3c;S4l+=H1w;S4l+=B0w;var V4l=T9w;V4l+=D4w;V4l+=m9w;V4l+=u3w;var E4l=K3n;E4l+=V9j;E4l+=B2w;container[E4l](V4l);container[F1n](container[v0b](S4l));}container[v0b](U3c)[t4l](K4l,function(e){E1aa.W2x();e[g0j]();if(conf[e3c]){var A4l=f0w;A4l+=N0w;A4l+=Z9w;A4l+=Z9w;var P4l=c9w;P4l+=n9w;P4l+=N7b;P4l+=E1aa[540234];Editor[D6w][P4l][H7w][A4l](editor,conf,H8w);}});container[v0b](k3c)[f4l](J3c,function(){var o3c="up";E1aa.W2x();var w4l=c2l;w4l+=b5w;w4l+=l9w;var y4l=o3c;y4l+=Z9w;y4l+=D4w;y4l+=Q5w;Editor[y4l](editor,conf,this[w4l],_buttonText,function(ids){var C4l=z3w;C4l+=N0w;C4l+=Z9w;C4l+=I9n;var N4l=V5w;N4l+=o3n;var R4l=f0w;R4l+=N0w;R4l+=Z9w;E1aa.W2x();R4l+=Z9w;dropCallback[R4l](editor,ids);container[N4l](k3c)[h2l][C4l]=p6w;});});return container;}function _triggerChange(input){E1aa.n2x();setTimeout(function(){E1aa.n2x();input[k3b](z9b,{editor:s8w,editorSet:s8w});;},h2l);}var baseFieldType=$[T4l](s8w,{},Editor[s4l][u3c],{get:function(conf){E1aa.W2x();return conf[Q3c][s9n]();},set:function(conf,val){var b4l=n4w;b4l+=Z9w;E1aa.W2x();conf[Q3c][b4l](val);_triggerChange(conf[Q3c]);},enable:function(conf){var e4l=n9w;e4l+=z9w;e4l+=D4w;e4l+=n9w;conf[Q3c][e4l](P0c,R8w);},disable:function(conf){var I4l=w1w;I4l+=l9w;I4l+=X6n;I4l+=B3c;E1aa.n2x();var X4l=V0w;X4l+=h5w;conf[Q3c][X4l](I4l,s8w);},canReturnSubmit:function(conf,node){return s8w;}});fieldTypes[W3c]={create:function(conf){var i4l=e4w;i4l+=s9n;conf[i4l]=conf[s5b];return p6w;},get:function(conf){E1aa.W2x();return conf[Y3c];},set:function(conf,val){var B4l=n3c;E1aa.n2x();B4l+=j7b;conf[B4l]=val;}};fieldTypes[c3c]=$[j4l](s8w,{},baseFieldType,{create:function(conf){var Z6c='<input/>';var a4l=y1w;a4l+=i9w;a4l+=z9w;var z4l=z9w;z4l+=c8n;z4l+=q7w;z4l+=n6w;var F4l=y9w;F4l+=E1aa[540234];var p4l=N0w;p4l+=i9w;p4l+=e5w;conf[Q3c]=$(Z6c)[p4l]($[c3w]({id:Editor[H6c](conf[F4l]),type:l6c,readonly:z4l},conf[a4l] || ({})));return conf[Q3c][h2l];}});fieldTypes[M4l]=$[U4l](s8w,{},baseFieldType,{create:function(conf){var Y4l=e4w;Y4l+=t0w;Y4l+=n9w;Y4l+=W8n;var W4l=y1w;W4l+=e5w;var Q4l=i9w;Q4l+=z2n;Q4l+=i9w;var u4l=y9w;u4l+=E1aa[540234];var o4l=H9w;E1aa.n2x();o4l+=u3b;var J4l=o8w;J4l+=w6w;J4l+=v6c;conf[Q3c]=$(J4l)[b5b]($[o4l]({id:Editor[H6c](conf[u4l]),type:Q4l},conf[W4l] || ({})));return conf[Y4l][h2l];}});fieldTypes[D6c]=$[n4l](s8w,{},baseFieldType,{create:function(conf){var h6c="pass";var q6c="wor";var L6c="<inpu";var l5l=h6c;l5l+=q6c;l5l+=E1aa[540234];var H5l=H9w;H5l+=e1w;H5l+=m0b;var Z5l=L6c;Z5l+=i9w;Z5l+=y3w;Z5l+=W8w;E1aa.n2x();var c4l=m6c;c4l+=i9w;conf[c4l]=$(Z5l)[b5b]($[H5l]({id:Editor[H6c](conf[r5w]),type:l5l},conf[b5b] || ({})));return conf[Q3c][h2l];}});fieldTypes[O6c]=$[v5l](s8w,{},baseFieldType,{create:function(conf){var x6c="<textarea></t";var G6c="extarea>";var q5l=N0w;q5l+=i9w;q5l+=i9w;q5l+=z9w;var h5l=x6c;h5l+=G6c;var D5l=G9w;D5l+=F6w;D5l+=c9w;D5l+=i9w;conf[D5l]=$(h5l)[b5b]($[c3w]({id:Editor[H6c](conf[r5w])},conf[q5l] || ({})));return conf[Q3c][h2l];},canReturnSubmit:function(conf,node){return R8w;}});fieldTypes[L5l]=$[c3w](s8w,{},baseFieldType,{_addOptions:function(conf,opts,append){var g6c="placehold";var S6c="placeholder";E1aa.n2x();var t6c="placeholderDisabled";var V6c="acehold";var E6c="erValue";var r6c="lder";var m5l=k6c;m5l+=H9n;var elOpts=conf[m5l][h2l][c9j];var countOffset=h2l;if(!append){var O5l=d6c;O5l+=r6c;elOpts[N8w]=h2l;if(conf[O5l] !== undefined){var G5l=g6c;G5l+=E6c;var x5l=g9n;x5l+=V6c;x5l+=E6c;var placeholderValue=conf[x5l] !== undefined?conf[G5l]:H8w;countOffset+=q2l;elOpts[h2l]=new Option(conf[S6c],placeholderValue);var disabled=conf[t6c] !== undefined?conf[t6c]:s8w;elOpts[h2l][W3c]=disabled;elOpts[h2l][f2w]=disabled;elOpts[h2l][K6c]=placeholderValue;}}else {var k5l=U7j;k5l+=d5w;countOffset=elOpts[k5l];}if(opts){var d5l=n9w;d5l+=N0w;d5l+=y9w;d5l+=i7c;Editor[d5l](opts,conf[P6c],function(val,label,i,attr){var option=new Option(label,val);option[K6c]=val;if(attr){$(option)[b5b](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var A6c="_add";var f6c="Opti";var C6c="lect></";var N6c="<se";var w6c="nge.dte";var y6c="cha";var R5l=e4w;R5l+=y9w;R5l+=T9w;R5l+=H9n;var w5l=A6c;w5l+=f6c;w5l+=G1b;var K5l=y6c;K5l+=w6c;var t5l=y1w;t5l+=i9w;t5l+=z9w;var S5l=R6c;S5l+=H9w;var V5l=y9w;V5l+=E1aa[540234];var E5l=y1w;E5l+=i9w;E5l+=z9w;var g5l=N6c;g5l+=C6c;g5l+=y4w;g5l+=s6j;var r5l=k6c;r5l+=H9n;conf[r5l]=$(g5l)[E5l]($[c3w]({id:Editor[H6c](conf[V5l]),multiple:conf[S5l] === s8w},conf[t5l] || ({})))[T0w](K5l,function(e,d){var T6c="lastSet";var P5l=x6w;P5l+=D4w;P5l+=z9w;if(!d || !d[P5l]){var y5l=E5w;y5l+=i9w;var f5l=l9w;f5l+=X1c;f5l+=f0w;f5l+=i9w;var A5l=e4w;A5l+=T6c;conf[A5l]=fieldTypes[f5l][y5l](conf);}});fieldTypes[o8j][w5l](conf,conf[c9j] || conf[s6c]);return conf[R5l][h2l];},update:function(conf,options,append){var b6c="sele";var T5l=k6c;T5l+=n9w;T5l+=W8n;var N5l=b6c;N5l+=C0w;fieldTypes[N5l][e6c](conf,options,append);var lastSet=conf[X6c];if(lastSet !== undefined){var C5l=l9w;C5l+=H9w;C5l+=i9w;fieldTypes[o8j][C5l](conf,lastSet,s8w);}_triggerChange(conf[T5l]);},get:function(conf){var B6c="sep";var j6c="ator";var i6c="toArr";var I6c="ultipl";var B5l=Z9w;B5l+=q5w;B5l+=f8w;var I5l=L0w;I5l+=I6c;I5l+=H9w;var X5l=i6c;X5l+=E9n;var e5l=L0w;e5l+=N0w;e5l+=n9w;var b5l=H5c;b5l+=l5c;var s5l=c2l;s5l+=o5w;var val=conf[Q3c][s5l](b5l)[e5l](function(){return this[K6c];})[X5l]();if(conf[I5l]){var i5l=B6c;i5l+=O9b;i5l+=j6c;return conf[p6c]?val[F3b](conf[i5l]):val;}return val[B5l]?val[h2l]:p6w;},set:function(conf,val,localUpdate){var M6c="selected";var z6c='option';var o5l=Z9w;o5l+=q5w;o5l+=K0w;o5l+=Y7n;var J5l=R6c;J5l+=H9w;var U5l=d6c;U5l+=P5w;U5l+=H1w;var z5l=e4w;z5l+=y9w;E1aa.W2x();z5l+=F6c;var F5l=Z9w;F5l+=q5w;F5l+=f8w;var j5l=W6w;j5l+=Y8c;if(!localUpdate){conf[X6c]=val;}if(conf[j5l] && conf[p6c] && !Array[r0n](val)){var p5l=Q3j;p5l+=X9b;val=typeof val === p5l?val[J3b](conf[p6c]):[];}else if(!Array[r0n](val)){val=[val];}var i,len=val[F5l],found,allFound=R8w;var options=conf[z5l][v0b](z6c);conf[Q3c][v0b](z6c)[z9n](function(){var a6c="editor_val";var M5l=v5c;M5l+=l5c;found=R8w;E1aa.W2x();for(i=h2l;i < len;i++){var a5l=e4w;a5l+=a6c;if(this[a5l] == val[i]){found=s8w;allFound=s8w;break;}}this[M5l]=found;});if(conf[U5l] && !allFound && !conf[J5l] && options[o5l]){options[h2l][M6c]=s8w;}if(!localUpdate){var u5l=e4w;u5l+=n2j;u5l+=c9w;u5l+=i9w;_triggerChange(conf[u5l]);}return allFound;},destroy:function(conf){var J6c=".dte";var Y5l=U6c;Y5l+=J6c;var W5l=D4w;W5l+=V5w;W5l+=V5w;var Q5l=m6c;Q5l+=i9w;conf[Q5l][W5l](Y5l);}});fieldTypes[o6c]=$[c3w](s8w,{},baseFieldType,{_addOptions:function(conf,opts,append){var val,label;var jqInput=conf[Q3c];var offset=h2l;if(!append){var n5l=y4j;n5l+=n9w;n5l+=i9w;n5l+=x0w;jqInput[n5l]();}else {var c5l=t0w;c5l+=K8w;c5l+=i9w;offset=$(c5l,jqInput)[N8w];}if(opts){Editor[u6c](opts,conf[P6c],function(val,label,i,attr){var Q6c="_va";var Z2c="box\" ";var l2c=" id=\"";var c6c="e=\"check";var H2c="eId";var n6c="\" typ";var W6c="</labe";var x7l=e4w;x7l+=c4b;x7l+=Q6c;x7l+=Z9w;var O7l=N0w;O7l+=c8b;O7l+=z9w;var m7l=o8w;m7l+=y3w;m7l+=r1b;var L7l=W6c;L7l+=Y6c;var q7l=y9w;q7l+=E1aa[540234];var h7l=T3w;h7l+=s3w;var D7l=n6c;D7l+=c6c;D7l+=Z2c;D7l+=v6c;var v7l=y9w;v7l+=E1aa[540234];var l7l=L9j;l7l+=V5w;l7l+=H2c;var H7l=n8c;H7l+=F6c;H7l+=l2c;var Z7l=o8w;Z7l+=E1aa[540234];Z7l+=Q8w;Z7l+=W8w;jqInput[F1n](Z7l + H7l + Editor[l7l](conf[v7l]) + v2c + (i + offset) + D7l + D2c + Editor[h7l](conf[q7l]) + v2c + (i + offset) + K6w + label + L7l + m7l);$(h2c,jqInput)[O7l](K0c,val)[h2l][x7l]=val;if(attr){$(h2c,jqInput)[b5b](attr);}});}},create:function(conf){var q2c='<div></div>';var G7l=k6c;G7l+=n9w;G7l+=W8n;conf[G7l]=$(q2c);fieldTypes[o6c][e6c](conf,conf[c9j] || conf[s6c]);return conf[Q3c][h2l];},get:function(conf){var k2c='input:checked';var L2c="separato";var x2c="tor";var m2c="jo";var d2c="unselectedValue";var O2c="separa";var G2c="electedValu";E1aa.W2x();var V7l=L2c;V7l+=z9w;var E7l=m2c;E7l+=y9w;E7l+=T9w;var g7l=O2c;g7l+=x2c;var d7l=H1n;d7l+=G2c;d7l+=H9w;var k7l=V5w;k7l+=y9w;k7l+=T9w;k7l+=E1aa[540234];var out=[];var selected=conf[Q3c][k7l](k2c);if(selected[N8w]){selected[z9n](function(){E1aa.W2x();out[F9n](this[K6c]);});}else if(conf[d7l] !== undefined){var r7l=n9w;r7l+=c9w;r7l+=l9w;r7l+=d5w;out[r7l](conf[d2c]);}return conf[g7l] === undefined || conf[p6c] === p6w?out:out[E7l](conf[V7l]);},set:function(conf,val){var g2c='|';var K7l=H9w;K7l+=N0w;K7l+=I0w;var t7l=y9w;t7l+=T9w;t7l+=n9w;E1aa.n2x();t7l+=W8n;var S7l=r2c;S7l+=W8n;var jqInputs=conf[S7l][v0b](t7l);if(!Array[r0n](val) && typeof val === o2n){val=val[J3b](conf[p6c] || g2c);}else if(!Array[r0n](val)){val=[val];}var i,len=val[N8w],found;jqInputs[K7l](function(){found=R8w;for(i=h2l;i < len;i++){if(this[K6c] == val[i]){found=s8w;break;}}E1aa.W2x();this[E2c]=found;});_triggerChange(jqInputs);},enable:function(conf){var f7l=E1aa[540234];f7l+=y1n;f7l+=X6n;f7l+=B3c;var A7l=n9w;A7l+=z9w;A7l+=D4w;A7l+=n9w;var P7l=r2c;P7l+=W8n;conf[P7l][v0b](J3c)[A7l](f7l,R8w);},disable:function(conf){var R7l=w1w;R7l+=L9j;R7l+=V2c;var w7l=n9w;w7l+=z9w;w7l+=D4w;w7l+=n9w;var y7l=V5w;y7l+=y9w;y7l+=T9w;y7l+=E1aa[540234];conf[Q3c][y7l](J3c)[w7l](R7l,s8w);},update:function(conf,options,append){var S2c="_addOptio";E1aa.W2x();var C7l=l9w;C7l+=H9w;C7l+=i9w;var N7l=S2c;N7l+=a6n;var checkbox=fieldTypes[o6c];var currVal=checkbox[P0n](conf);checkbox[N7l](conf,options,append);checkbox[C7l](conf,currVal);}});fieldTypes[T7l]=$[s7l](s8w,{},baseFieldType,{_addOptions:function(conf,opts,append){var t2c="inpu";var b7l=e4w;b7l+=t2c;b7l+=i9w;var val,label;var jqInput=conf[b7l];var offset=h2l;if(!append){var e7l=y4j;e7l+=n9w;e7l+=i9w;e7l+=x0w;jqInput[e7l]();}else {offset=$(J3c,jqInput)[N8w];}if(opts){Editor[u6c](opts,conf[P6c],function(val,label,i,attr){var A2c="type=\"radio\" name=\"";var P2c="\" /";var y2c="t:la";var f2c='<input id="';var a7l=K2c;a7l+=H9w;var z7l=N0w;z7l+=V4n;var F7l=o8w;F7l+=y3w;F7l+=E1aa[540234];F7l+=r8b;var p7l=o8w;p7l+=y3w;p7l+=w3w;var j7l=F4w;j7l+=H9w;j7l+=Z2n;j7l+=E1aa[540234];var B7l=P2c;B7l+=W8w;var i7l=s6n;i7l+=A2c;var I7l=y9w;I7l+=E1aa[540234];var X7l=y6j;X7l+=y9w;X7l+=z3w;X7l+=W8w;jqInput[F1n](X7l + f2c + Editor[H6c](conf[I7l]) + v2c + (i + offset) + i7l + conf[h6w] + B7l + D2c + Editor[j7l](conf[r5w]) + v2c + (i + offset) + K6w + label + p7l + F7l);$(h2c,jqInput)[z7l](a7l,val)[h2l][K6c]=val;if(attr){var M7l=n2j;M7l+=c9w;M7l+=y2c;M7l+=x9n;$(M7l,jqInput)[b5b](attr);}});}},create:function(conf){var R2c="radi";var w2c="ipOp";var N2c='<div />';var Q7l=D4w;Q7l+=n9w;Q7l+=H9w;Q7l+=T9w;var u7l=w2c;u7l+=i9w;u7l+=l9w;var o7l=D4w;o7l+=n9w;E1aa.n2x();o7l+=Z7w;o7l+=l9w;var J7l=R2c;J7l+=D4w;var U7l=G9w;U7l+=T9w;U7l+=H9n;conf[U7l]=$(N2c);fieldTypes[J7l][e6c](conf,conf[o7l] || conf[u7l]);this[T0w](Q7l,function(){var Y7l=H9w;Y7l+=N0w;E1aa.n2x();Y7l+=f0w;Y7l+=d5w;var W7l=y9w;W7l+=F6w;W7l+=W8n;conf[Q3c][v0b](W7l)[Y7l](function(){var C2c="Che";var n7l=z4b;n7l+=H9w;n7l+=C2c;n7l+=T2c;if(this[n7l]){var c7l=I0w;c7l+=K7w;c7l+=B0w;this[c7l]=s8w;}});});return conf[Q3c][h2l];},get:function(conf){var s2c="input:ch";var H8l=Z9w;H8l+=H9w;H8l+=T9w;E1aa.W2x();H8l+=f8w;var Z8l=s2c;Z8l+=U7w;Z8l+=W2n;Z8l+=E1aa[540234];var el=conf[Q3c][v0b](Z8l);return el[H8l]?el[h2l][K6c]:undefined;},set:function(conf,val){var e2c="hecked";var b2c="input:c";var q8l=b2c;q8l+=e2c;var l8l=y9w;l8l+=T9w;l8l+=K8w;l8l+=i9w;var that=this;conf[Q3c][v0b](l8l)[z9n](function(){var i2c="checke";var I2c="_preCh";var B2c="_preChecked";var X2c="_preChe";var v8l=X2c;v8l+=T2c;this[v8l]=R8w;if(this[K6c] == val){var D8l=I2c;D8l+=U7w;D8l+=V7w;D8l+=B0w;this[E2c]=s8w;this[D8l]=s8w;}else {var h8l=i2c;h8l+=E1aa[540234];this[h8l]=R8w;this[B2c]=R8w;}});_triggerChange(conf[Q3c][v0b](q8l));},enable:function(conf){var j2c="isabled";var O8l=E1aa[540234];O8l+=j2c;var m8l=n9w;m8l+=u3w;var L8l=e4w;L8l+=y9w;L8l+=T9w;L8l+=H9n;conf[L8l][v0b](J3c)[m8l](O8l,R8w);},disable:function(conf){var G8l=E1aa[540234];G8l+=y1n;G8l+=X6n;G8l+=B3c;var x8l=c2l;x8l+=o5w;conf[Q3c][x8l](J3c)[p2c](G8l,s8w);},update:function(conf,options,append){var F2c="[val";var z2c="ue=\"";var a2c="radio";var V8l=K2c;V8l+=H9w;var E8l=y1w;E8l+=i9w;E8l+=z9w;var g8l=H9w;g8l+=K6n;var r8l=Z9w;r8l+=F0b;r8l+=d5w;E1aa.W2x();var d8l=F2c;d8l+=z2c;var k8l=l9w;k8l+=H9w;k8l+=i9w;var radio=fieldTypes[a2c];var currVal=radio[P0n](conf);radio[e6c](conf,options,append);var inputs=conf[Q3c][v0b](J3c);radio[k8l](conf,inputs[o7j](d8l + currVal + G8w)[r8l]?currVal:inputs[g8l](h2l)[E8l](V8l));}});fieldTypes[S2j]=$[c3w](s8w,{},baseFieldType,{create:function(conf){var o2c="dateFor";var Q2c="RFC_28";var M2c="datep";var W2c="teF";var U2c="icker";var J2c="put /";var u2c='jqueryui';var B8l=e4w;B8l+=y9w;B8l+=T9w;B8l+=H9n;var f8l=M2c;f8l+=U2c;var A8l=y9w;A8l+=E1aa[540234];E1aa.W2x();var P8l=z2n;P8l+=J4b;P8l+=E1aa[540234];var K8l=N0w;K8l+=i9w;K8l+=i9w;K8l+=z9w;var t8l=n8c;t8l+=T9w;t8l+=J2c;t8l+=W8w;var S8l=e4w;S8l+=t0w;S8l+=H9n;conf[S8l]=$(t8l)[K8l]($[P8l]({id:Editor[H6c](conf[A8l]),type:l6c},conf[b5b]));if($[f8l]){var w8l=o2c;w8l+=O6j;var y8l=Q5w;y8l+=y2n;conf[Q3c][y8l](u2c);if(!conf[w8l]){var N8l=Q2c;N8l+=f7w;N8l+=f7w;var R8l=v9w;R8l+=W2c;R8l+=z1w;R8l+=O6j;conf[R8l]=$[Y2c][N8l];}setTimeout(function(){var n2c="For";var Z9Z='#ui-datepicker-div';var c2c="dateImage";var b8l=u0n;b8l+=l9w;var s8l=D4w;s8l+=n9w;s8l+=Z0n;var T8l=S2j;T8l+=n2c;T8l+=O6j;var C8l=n8j;C8l+=E1aa[540234];$(conf[Q3c])[Y2c]($[C8l]({dateFormat:conf[T8l],buttonImage:conf[c2c],buttonImageOnly:s8w,onSelect:function(){E1aa.W2x();conf[Q3c][D2w]()[A5n]();}},conf[s8l]));$(Z9Z)[b8l](u9n,V9n);},d2l);}else {var i8l=E1aa[540234];i8l+=N0w;i8l+=S9w;var I8l=i9w;I8l+=p4w;I8l+=H9w;var X8l=y1w;X8l+=e5w;var e8l=k6c;e8l+=H9n;conf[e8l][X8l](I8l,i8l);}return conf[B8l][h2l];},set:function(conf,val){var H9Z="hasDate";var D9Z="datepi";var h9Z="cker";var v9Z="asCl";E1aa.W2x();var p8l=H9Z;p8l+=l9Z;var j8l=d5w;j8l+=v9Z;j8l+=J6b;if($[Y2c] && conf[Q3c][j8l](p8l)){var z8l=D9Z;z8l+=h9Z;var F8l=G9w;F8l+=F6w;F8l+=c9w;F8l+=i9w;conf[F8l][z8l](a4c,val)[U6c]();}else {var a8l=z3w;a8l+=N0w;a8l+=Z9w;$(conf[Q3c])[a8l](val);}},enable:function(conf){E1aa.n2x();var q9Z="enable";if($[Y2c]){conf[Q3c][Y2c](q9Z);}else {$(conf[Q3c])[p2c](P0c,R8w);}},disable:function(conf){E1aa.n2x();var L9Z="datepicke";if($[Y2c]){var J8l=w1w;J8l+=L9j;J8l+=y5w;J8l+=b5w;var U8l=L9Z;U8l+=z9w;var M8l=r2c;M8l+=c9w;M8l+=i9w;conf[M8l][U8l](J8l);}else {var Q8l=E1aa[540234];Q8l+=y1n;Q8l+=N3c;var u8l=n9w;u8l+=z9w;u8l+=D4w;u8l+=n9w;var o8l=k6c;o8l+=H9n;$(conf[o8l])[u8l](Q8l,s8w);}},owns:function(conf,node){var O9Z="atepicker";var d9Z="tepick";var k9Z="iv.ui-da";var G9Z="ader";var x9Z="-he";var m9Z="div.ui-d";var Z3l=Z9w;Z3l+=q5w;Z3l+=f8w;var c8l=m9Z;c8l+=O9Z;c8l+=x9Z;c8l+=G9Z;var n8l=Z9w;n8l+=x2n;var Y8l=E1aa[540234];Y8l+=k9Z;Y8l+=d9Z;Y8l+=H1w;var W8l=i3b;W8l+=q5w;W8l+=i9w;W8l+=l9w;return $(node)[W8l](Y8l)[n8l] || $(node)[T2w](c8l)[Z3l]?s8w:R8w;}});fieldTypes[H3l]=$[l3l](s8w,{},baseFieldType,{create:function(conf){var V9Z="datetime";var g9Z='<input />';var E9Z="displayFormat";var g3l=G9w;g3l+=d9c;g3l+=i9w;var r3l=l7n;r3l+=y4w;var k3l=W2n;k3l+=x0w;k3l+=Z2n;k3l+=F6c;var x3l=e4w;x3l+=X4n;E1aa.n2x();x3l+=t2w;var O3l=y9w;O3l+=Y3w;O3l+=n3w;O3l+=T9w;var m3l=V5w;m3l+=z1w;m3l+=N9b;m3l+=i9w;var L3l=z2n;L3l+=m0b;var q3l=k6c;q3l+=K8w;q3l+=i9w;var h3l=r9Z;h3l+=W2n;h3l+=z9w;var D3l=i9w;D3l+=H9w;D3l+=e1w;D3l+=i9w;var v3l=y9w;v3l+=E1aa[540234];conf[Q3c]=$(g9Z)[b5b]($[c3w](s8w,{id:Editor[H6c](conf[v3l]),type:D3l},conf[b5b]));conf[h3l]=new Editor[g8c](conf[q3l],$[L3l]({format:conf[E9Z] || conf[m3l],i18n:this[O3l][V9Z]},conf[r2w]));conf[x3l]=function(){var S9Z="hide";var G3l=r9Z;G3l+=V7w;G3l+=H1w;conf[G3l][S9Z]();};if(conf[k3l] === R8w){conf[Q3c][T0w](U9j,function(e){var K9Z="efaul";var t9Z="entD";var d3l=a9j;d3l+=t9Z;d3l+=K9Z;d3l+=i9w;e[d3l]();});}this[T0w](r3l,conf[P9Z]);return conf[g3l][h2l];},get:function(conf){var f9Z="tSt";E1aa.n2x();var R9Z="ale";var y9Z="rict";var w9Z="momentLo";var A9Z="omen";var K3l=L0w;K3l+=A9Z;K3l+=f9Z;K3l+=y9Z;var t3l=w9Z;t3l+=f0w;t3l+=R9Z;var S3l=e4w;S3l+=l9Z;var V3l=z3w;V3l+=N0w;V3l+=Z9w;var E3l=G9w;E3l+=T9w;E3l+=n9w;E3l+=W8n;var val=conf[E3l][V3l]();var inst=conf[S3l][f0w];return val && conf[N9Z] && moment?moment(val,inst[E2j],inst[t3l],inst[K3l])[E2j](conf[N9Z]):val;},set:function(conf,val){var s9Z="omentL";var I9Z="pic";var C9Z="men";var X9Z="reFormat";var e9Z="wi";var b9Z="ocal";var T9Z="tStrict";var R3l=H0w;R3l+=m6j;var w3l=h7w;E1aa.W2x();w3l+=C9Z;w3l+=T9Z;var y3l=L0w;y3l+=s9Z;y3l+=b9Z;y3l+=H9w;var f3l=e9Z;f3l+=X9Z;var A3l=z3w;A3l+=N0w;A3l+=Z9w;var P3l=e4w;P3l+=I9Z;P3l+=W2n;P3l+=z9w;var inst=conf[P3l][f0w];conf[i9Z][A3l](val && conf[f3l] && moment?moment(val,conf[N9Z],inst[y3l],inst[w3l])[E2j](inst[R3l]):val);_triggerChange(conf[Q3c]);},owns:function(conf,node){var B9Z="owns";return conf[i9Z][B9Z](node);},errorMessage:function(conf,msg){var j9Z="ker";var p9Z="errorMsg";var N3l=e4w;N3l+=n9w;N3l+=L8c;N3l+=j9Z;conf[N3l][p9Z](msg);},destroy:function(conf){var z9Z="cke";var F9Z="dest";var b3l=F9Z;b3l+=H4w;b3l+=x0w;var s3l=p6n;s3l+=y9w;s3l+=z9Z;s3l+=z9w;var T3l=D4w;T3l+=V5w;T3l+=V5w;var C3l=f0w;C3l+=Z9w;C3l+=S4n;E1aa.W2x();this[I5n](C3l,conf[P9Z]);conf[Q3c][T3l](U9j);conf[s3l][b3l]();},minDate:function(conf,min){E1aa.W2x();var a9Z="min";conf[i9Z][a9Z](min);},maxDate:function(conf,max){var M9Z="max";var e3l=r9Z;e3l+=V7w;E1aa.n2x();e3l+=H9w;e3l+=z9w;conf[e3l][M9Z](max);}});fieldTypes[X5b]=$[X3l](s8w,{},baseFieldType,{create:function(conf){var editor=this;E1aa.n2x();var container=_commonUpload(editor,conf,function(val){var I3l=l9w;I3l+=H9w;I3l+=i9w;Editor[D6w][X5b][I3l][c2n](editor,conf,val[h2l]);editor[G4b](U9Z,[conf[h6w],val[h2l]]);});return container;},get:function(conf){var i3l=e4w;i3l+=n4w;i3l+=Z9w;return conf[i3l];},set:function(conf,val){var J9Z="div.clearValu";var l0Z='upload.editor';var Q9Z="</span";var c9Z="clearText";var u9Z='div.rendered';var Z0Z="noClea";var W9Z="<spa";var n9Z='No file';var o9Z="e button";var H0Z='noClear';var n3l=n3c;n3l+=N0w;n3l+=Z9w;var Y3l=t0w;Y3l+=n9w;Y3l+=c9w;Y3l+=i9w;var W3l=e4w;W3l+=t0w;W3l+=H9n;var J3l=J9Z;J3l+=o9Z;E1aa.W2x();var U3l=V5w;U3l+=o3n;var B3l=E1aa[540234];B3l+=T5w;conf[Y3c]=val;var container=conf[Q3c];if(conf[B3l]){var p3l=n3c;p3l+=N0w;p3l+=Z9w;var j3l=c2l;j3l+=o5w;var rendered=container[j3l](u9Z);if(conf[p3l]){var z3l=e4w;z3l+=z3w;z3l+=N0w;z3l+=Z9w;var F3l=N5w;F3l+=n9w;F3l+=C4j;rendered[P9n](conf[F3l](conf[z3l]));}else {var M3l=Q9Z;M3l+=W8w;var a3l=W9Z;a3l+=R1c;rendered[I2n]()[F1n](a3l + (conf[Y9Z] || n9Z) + M3l);}}var button=container[U3l](J3l);if(val && conf[c9Z]){var Q3l=Z0Z;Q3l+=z9w;var u3l=x3w;u3l+=L0w;u3l+=X3c;var o3l=d5w;o3l+=S8j;o3l+=Z9w;button[o3l](conf[c9Z]);container[u3l](Q3l);}else {container[A2w](H0Z);}conf[W3l][v0b](Y3l)[O2b](l0Z,[conf[n3l]]);},enable:function(conf){var l6l=E1aa[540234];l6l+=y9w;l6l+=L9j;l6l+=V2c;var H6l=n9w;H6l+=H4w;H6l+=n9w;var Z6l=V5w;Z6l+=t0w;Z6l+=E1aa[540234];E1aa.W2x();var c3l=G9w;c3l+=T9w;c3l+=H9n;conf[c3l][Z6l](J3c)[H6l](l6l,R8w);conf[e3c]=s8w;},disable:function(conf){var q6l=v2n;q6l+=M9n;q6l+=V2c;var h6l=E1aa[540234];h6l+=y1n;h6l+=X6n;h6l+=B3c;var D6l=V5w;D6l+=y9w;D6l+=T9w;D6l+=E1aa[540234];E1aa.W2x();var v6l=e4w;v6l+=n2j;v6l+=c9w;v6l+=i9w;conf[v6l][D6l](J3c)[p2c](h6l,s8w);conf[q6l]=R8w;},canReturnSubmit:function(conf,node){return R8w;}});fieldTypes[L6l]=$[m6l](s8w,{},baseFieldType,{_showHide:function(conf){var D0Z="mitHide";var v0Z="splay";E1aa.n2x();var h0Z="_containe";var q0Z="limit";var k6l=e4w;k6l+=z3w;k6l+=N0w;k6l+=Z9w;var G6l=w1w;G6l+=v0Z;var x6l=l5n;x6l+=s1w;x6l+=D0Z;var O6l=h0Z;O6l+=z9w;if(!conf[q0Z]){return;}conf[O6l][v0b](x6l)[M6w](G6l,conf[Y3c][N8w] >= conf[q0Z]?V9n:Q9n);conf[a7b]=conf[q0Z] - conf[k6l][N8w];},create:function(conf){var m0Z="lti";var L0Z=".r";var r0Z="_container";var O0Z="ddCl";var P6l=l5b;P6l+=T9w;P6l+=L0Z;P6l+=E4j;var K6l=i8w;K6l+=m0Z;var t6l=N0w;t6l+=O0Z;t6l+=N0w;t6l+=w0w;var editor=this;var container=_commonUpload(editor,conf,function(val){var x0Z="adMan";var G0Z="concat";var S6l=e4w;S6l+=z3w;S6l+=j7b;var V6l=v2n;V6l+=q2b;var E6l=e4w;E6l+=z3w;E6l+=N0w;E6l+=Z9w;var g6l=y4w;g6l+=i9w;var r6l=r7b;r6l+=x0Z;r6l+=x0w;var d6l=e4w;d6l+=z3w;d6l+=N0w;d6l+=Z9w;conf[d6l]=conf[Y3c][G0Z](val);Editor[D6w][r6l][g6l][c2n](editor,conf,conf[E6l]);editor[V6l](U9Z,[conf[h6w],conf[S6l]]);},s8w);container[t6l](K6l)[T0w](i1b,P6l,function(e){var k0Z="nab";var d0Z="uploadMany";var A6l=v2n;A6l+=k0Z;A6l+=B3c;e[H0c]();if(conf[A6l]){var w6l=c2l;w6l+=W3w;var y6l=y9w;y6l+=E1aa[540234];y6l+=e1w;var f6l=E1aa[540234];f6l+=N0w;f6l+=i9w;f6l+=N0w;var idx=$(this)[f6l](y6l);conf[Y3c][i3n](idx,q2l);Editor[w6l][d0Z][H7w][c2n](editor,conf,conf[Y3c]);}});conf[r0Z]=container;return container;},get:function(conf){E1aa.n2x();return conf[Y3c];},set:function(conf,val){var N0Z="<ul></u";var g0Z="pload.editor";var t0Z="wHid";var E0Z="trigg";var K0Z="oadMany";var B0Z='No files';var P0Z="Uploa";var A0Z="d collections must ha";var w0Z="ndered";var f0Z="ve an array as a value";var y0Z="iv.re";var V0Z="Hand";var S0Z="ler";var i0Z='<span>';var R0Z="dTo";var J6l=c9w;J6l+=g0Z;var U6l=E0Z;U6l+=H1w;U6l+=V0Z;U6l+=S0Z;var M6l=y9w;E1aa.n2x();M6l+=T9w;M6l+=n9w;M6l+=W8n;var a6l=G9w;a6l+=T9w;a6l+=n9w;a6l+=W8n;var z6l=H7n;z6l+=D4w;z6l+=t0Z;z6l+=H9w;var F6l=R8c;F6l+=K0Z;var p6l=u3c;p6l+=l9w;var T6l=w1w;T6l+=S6b;T6l+=N0w;T6l+=x0w;var C6l=r2c;C6l+=W8n;var R6l=Q6b;R6l+=z9w;R6l+=C3b;if(!val){val=[];}if(!Array[R6l](val)){var N6l=P0Z;N6l+=A0Z;N6l+=f0Z;throw N6l;}conf[Y3c]=val;var that=this;var container=conf[C6l];if(conf[T6l]){var s6l=E1aa[540234];s6l+=y0Z;s6l+=w0Z;var rendered=container[v0b](s6l)[I2n]();if(val[N8w]){var e6l=N0w;e6l+=x6b;e6l+=q5w;e6l+=R0Z;var b6l=N0Z;b6l+=Y6c;var list=$(b6l)[e6l](rendered);$[z9n](val,function(i,file){var b0Z="n class=\"";var T0Z="orm";var s0Z=" <butto";var X0Z=' remove" data-idx="';var C0Z="</li";var e0Z="i>";var I0Z='">&times;</button>';var j6l=C0Z;j6l+=W8w;var B6l=V5w;B6l+=T0Z;var i6l=s0Z;i6l+=b0Z;var I6l=E1aa[540234];I6l+=y9w;I6l+=O3b;I6l+=C4j;E1aa.n2x();var X6l=o8w;X6l+=Z9w;X6l+=e0Z;list[F1n](X6l + conf[I6l](file,i) + i6l + that[i2w][B6l][G1n] + X0Z + i + I0Z + j6l);});}else {rendered[F1n](i0Z + (conf[Y9Z] || B0Z) + C6w);}}Editor[p6l][F6l][z6l](conf);conf[a6l][v0b](M6l)[U6l](J6l,[conf[Y3c]]);},enable:function(conf){var j0Z="nable";var p0Z="sabled";var W6l=v2n;W6l+=j0Z;W6l+=E1aa[540234];var Q6l=E1aa[540234];Q6l+=y9w;Q6l+=p0Z;var u6l=n2j;u6l+=W8n;var o6l=s4c;E1aa.W2x();o6l+=E1aa[540234];conf[Q3c][o6l](u6l)[p2c](Q6l,R8w);conf[W6l]=s8w;},disable:function(conf){var Z2l=N5w;Z2l+=N0w;Z2l+=h3n;Z2l+=E1aa[540234];var c6l=n9w;c6l+=u3w;var n6l=c2l;n6l+=T9w;n6l+=E1aa[540234];var Y6l=G9w;Y6l+=d9c;Y6l+=i9w;conf[Y6l][n6l](J3c)[c6l](Z2l,s8w);conf[e3c]=R8w;},canReturnSubmit:function(conf,node){E1aa.W2x();return R8w;}});})();if(DataTable[A1n][F0Z]){var v2l=z2n;v2l+=i9w;var l2l=r3n;l2l+=w8c;var H2l=H9w;H2l+=z0Z;H2l+=T9w;H2l+=E1aa[540234];$[H2l](Editor[l2l],DataTable[v2l][F0Z]);}DataTable[A1n][F0Z]=Editor[D6w];Editor[D2l]={};Editor[k2w][a0Z]=q8w;Editor[M0Z]=U0Z;return Editor;});

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = '<h5 class="modal-title">'+i18nDefaults.create.title+'</h5>';
i18nDefaults.edit.title = '<h5 class="modal-title">'+i18nDefaults.edit.title+'</h5>';
i18nDefaults.remove.title = '<h5 class="modal-title">'+i18nDefaults.remove.title+'</h5>';

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn",
		"buttonInternal": "btn btn-outline-secondary"
	},
	"field": {
		"wrapper": "DTE_Field form-group row",
		"label":   "col-lg-4 col-form-label",
		"input":   "col-lg-8",
		"error":   "error is-invalid",
		"msg-labelInfo": "form-text text-secondary small",
		"msg-info":      "form-text text-secondary small",
		"msg-message":   "form-text text-secondary small",
		"msg-error":     "form-text text-danger small",
		"multiValue":    "card multi-value",
		"multiInfo":     "small",
		"multiRestore":  "card multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		var conf = {
			// Note that `modal-dialog-scrollable` is BS4.3+ only. It has no effect on 4.0-4.2
			content: $(
				'<div class="modal fade DTED">'+
					'<div class="modal-dialog modal-dialog-scrollable"></div>'+
				'</div>'
			),
			close: $('<button class="close">&times;</div>')
				.attr('title', dte.i18n.close)
				.on('click', function () {
					dte.close('icon');
				}),
			shown: false,
			fullyShow: false
		}

		// This is a bit horrible, but if you mousedown and then drag out of the modal container, we don't
		// want to trigger a background action.
		var allowBackgroundClick = false;
		$(document).on('mousedown', 'div.modal', function (e) {
			allowBackgroundClick = $(e.target).hasClass('modal') && conf.shown
				? true
				: false;
		} );

		$(document).on('click', 'div.modal', function (e) {
			if ( $(e.target).hasClass('modal') && allowBackgroundClick ) {
				dte.background();
			}
		} );

		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );
			} );
		} );

		dte._bootstrapDisplay = conf;

		return DataTable.Editor.display.bootstrap;
	},

	"open": function ( dte, append, callback ) {
		var conf = dte._bootstrapDisplay;

		$(append).addClass('modal-content');

		if ( conf._shown ) {
			// Modal already up, so just draw in the new content
			var content = conf.content.find('div.modal-dialog');
			content.children().detach();
			content.append( append );

			if ( callback ) {
				callback();
			}
			return;
		}

		conf.shown = true;
		conf.fullyDisplayed = false;

		var content = conf.content.find('div.modal-dialog');
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).append( conf.close );

		$(conf.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( dte.s.setFocus ) {
					dte.s.setFocus.focus();
				}

				conf.fullyDisplayed = true;

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				conf.shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );
	},

	"close": function ( dte, callback ) {
		var conf = dte._bootstrapDisplay;

		if ( !conf.shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
		// before it has been fully displayed
		if ( ! conf.fullyDisplayed ) {
			$(conf.content)
				.one('shown.bs.modal', function () {
					conf.close( dte, callback );
				} );

			return;
		}

		$(conf.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		conf.shown = false;
		conf.fullyDisplayed = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return dte._bootstrapDisplay.content[0];
	}
} );


return DataTable.Editor;
}));


