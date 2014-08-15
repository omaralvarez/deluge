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
    //autoScroll: true,

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

        this.emailNotiFset = new Ext.form.FieldSet({
            xtype: 'fieldset',
            border: false,
            title: _('Email Notifications'),
            autoHeight: true,
            defaultType: 'textfield',
            style: 'margin-top: 3px; margin-bottom: 0px; padding-bottom: 0px;',
            autoWidth: true,
            labelWidth: 1
        });

        this.chkEnableEmail = this.emailNotiFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'enable_email',
            xtype: 'checkbox',
            boxLabel: 'Enabled'
        });

        this.hBoxEmail = this.emailNotiFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'sound',
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'label',
                text: _('Hostname:'),
                margins: '6 0 0 6'
            },{
                xtype: 'textfield',
                margins: '2 0 0 3'
            },{
                xtype: 'label',
                text: _('Port:'),
                margins: '6 0 0 6'
            },{
                xtype: 'spinnerfield',
                margins: '2 0 0 3',
                width: 60
            }]
        });

        this.hBoxUser = this.emailNotiFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'username',
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'label',
                text: _('Username:'),
                margins: '6 0 0 6'
            },{
                xtype: 'textfield',
                margins: '2 0 0 3'
            }]
        });

        this.hBoxPassword = this.emailNotiFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'password',
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'label',
                text: _('Password:'),
                margins: '6 0 0 6'
            },{
                xtype: 'textfield',
                margins: '2 0 0 5'
            }]
        });

        this.hBoxFrom = this.emailNotiFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'from',
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'label',
                text: _('From:'),
                margins: '6 0 0 6'
            },{
                xtype: 'textfield',
                margins: '2 0 0 27'
            }]
        });

        this.chkTLS = this.emailNotiFset.add({
            fieldLabel: _(''),
            labelSeparator: '',
            name: 'enable_tls_ssl',
            xtype: 'checkbox',
            boxLabel: 'Server requires TLS/SSL'
        });

        this.recipientsFset = new Ext.form.FieldSet({
            xtype: 'fieldset',
            border: false,
            title: _('Recipients'),
            autoHeight: true,
            defaultType: 'editorgrid',
            style: 'margin-top: 3px; margin-bottom: 0px; padding-bottom: 0px;',
            autoWidth: true,
            items: [{
                fieldLabel: _(''),
                name: 'recipients',
                margins: '2 0 5 5',
                height: 100,
                width: 260,
                autoExpandColumn: 'recipient',
                viewConfig: {
                    emptyText: _('Add an recipient...'),
                    deferEmptyText: false
                },
                colModel: new Ext.grid.ColumnModel({
                    columns: [{
                            id: 'recipient',
                            header: _('Recipient'),
                            dataIndex: 'recipient',
                            sortable: true,
                            hideable: false,
                            editable: true,
                            editor: {
                                xtype: 'textfield'
                            }
                        }]
                }),
                selModel: new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    moveEditorOnEnter: false
                }),
                store: new Ext.data.ArrayStore({
                    autoDestroy: true,
                    fields: [{name: 'recipient'}]
                }),
                listeners: {
                    afteredit: function(e) {
                        e.record.commit();
                    }
                },
                setEmptyText: function(text) {
                    if (this.viewReady) {
                        this.getView().emptyText = text;
                        this.getView().refresh();
                    } else {
                        Ext.apply(this.viewConfig, {emptyText: text});
                    }
                },
                loadData: function(data) {
                    this.getStore().loadData(data);
                    if (this.viewReady) {
                        this.getView().updateHeaders();
                    }
                }
            }]
        });

        this.recipButtonsContainer = this.recipientsFset.add({
            xtype: 'container',
            layout: 'hbox',
            margins: '4 0 0 5',
            items: [{
                    xtype: 'button',
                    text: 'Add',
                    margins: '0 5 0 0'
                },{
                    xtype: 'button',
                    text: 'Remove'
                }]
        });

        this.tabPanSettings = this.add({
            xtype: 'tabpanel',
            activeTab: 0,
            items: [{
                title: 'Settings',
                items: [this.uiSettingsFset,this.emailNotiFset,this.recipientsFset],
                autoScroll: true
            },{
                title: 'Subscriptions'
            },{
                title: 'Sound Customization'
            }]
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