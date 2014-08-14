/*!
 * notifications.js
 *
 * Copyright (c) Omar Alvarez 2014 <omar.alvarez@udc.es>
 *
 * This file is part of Deluge and is licensed under GNU General Public License 3.0, or later, with
 * the additional special exception to link portions of this program with the OpenSSL library.
 * See LICENSE for more details.
 *
 */

Ext.ns('Deluge.ux.preferences');

/**
 * @class Deluge.ux.preferences.NotificationsPage
 * @extends Ext.Panel
 */
Deluge.ux.preferences.NotificationsPage = Ext.extend(Ext.Panel, {

    title: _('Notifications'),
    layout: 'fit',
    border: false,
    autoScroll: true,

    initComponent: function() {
        Deluge.ux.preferences.NotificationsPage.superclass.initComponent.call(this);

        this.uiSettingsFset = new Ext.form.FieldSet({
            xtype: 'fieldset',
            border: false,
            title: _('UI Notifications'),
            autoHeight: true,
            defaultType: 'checkbox',
            style: 'margin-top: 3px; margin-bottom: 0px; padding-bottom: 0px;',
            autoWidth: true,
            labelWidth: 1
        });

        this.chkBlinks = this.uiSettingsFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'blinks',
            boxLabel: 'Tray icon blinks enabled'
        });

        this.chkPopups = this.uiSettingsFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'popups',
            boxLabel: 'Popups enabled'
        });

        this.hBoxSound = this.uiSettingsFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'sound',
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'checkbox',
                boxLabel: 'Sound enabled',
                margins: '0 0 0 6'
            },{
                xtype: 'textfield',
                margins: '0 0 0 3',
                width: '60%'
            }]
        });

        this.tabPanSettings = this.add({
            xtype: 'tabpanel',
            activeTab: 0,
            items: [{
                    title: 'Settings',
                    items: [this.uiSettingsFset]
            }
            ]
        });
        
    },

});

Deluge.plugins.NotificationsPlugin = Ext.extend(Deluge.Plugin, {

    name: 'Notifications',

    onDisable: function() {
        deluge.preferences.removePage(this.prefsPage);
    },

    onEnable: function() {
        this.prefsPage = deluge.preferences.addPage(new Deluge.ux.preferences.NotificationsPage());
    }
});
Deluge.registerPlugin('Notifications', Deluge.plugins.NotificationsPlugin);