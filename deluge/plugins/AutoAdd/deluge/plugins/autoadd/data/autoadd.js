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

Ext.ns('Deluge.ux');

/**
 * @class Deluge.ux.AutoaddWindowBase
 * @extends Ext.Window
 */
Deluge.ux.AutoaddWindowBase = Ext.extend(Ext.Window, {
    layout: 'fit',
    width: 400,
    height: 130,
    closeAction: 'hide',

    initComponent: function() {
        Deluge.ux.AutoaddWindowBase.superclass.initComponent.call(this);
        this.addButton(_('Cancel'), this.onCancelClick, this);

        this.form = this.add({
            xtype: 'form',
            baseCls: 'x-plain',
            bodyStyle: 'padding: 5px',
            items: [{
                    xtype: 'combo',
                    width: 270,
                    fieldLabel: _('Event'),
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'text'],
                        data: [
                                ['complete', _('Torrent Complete')],
                                ['added', _('Torrent Added')],
                                ['removed', _('Torrent Removed')]
                            ]
                    }),
                    name: 'event',
                    mode: 'local',
                    editable: false,
                    triggerAction: 'all',
                    valueField:    'id',
                    displayField:  'text'
                }, {
                    xtype: 'textfield',
                    fieldLabel: _('Command'),
                    name: 'command',
                    width: 270
                }]
        });
    },

    onCancelClick: function() {
        this.hide();
    }
});

/**
 * @class Deluge.ux.EditAutoaddFolderWindow
 * @extends Deluge.ux.AutoaddWindowBase
 */
Deluge.ux.EditAutoaddFolderWindow = Ext.extend(Deluge.ux.AutoaddWindowBase, {

    title: _('Edit Command'),

    initComponent: function() {
        Deluge.ux.EditAutoaddFolderWindow.superclass.initComponent.call(this);
        this.addButton(_('Save'), this.onSaveClick, this);
        this.addEvents({
            'commandedit': true
        });
    },

    show: function(command) {
        Deluge.ux.EditAutoaddCommandWindow.superclass.show.call(this);
        this.command = command;
        this.form.getForm().setValues({
            event: command.get('event'),
            command: command.get('name')
        });
    },

    onSaveClick: function() {
        var values = this.form.getForm().getFieldValues();
        deluge.client.execute.save_command(this.command.id, values.event, values.command, {
            success: function() {
                this.fireEvent('commandedit', this, values.event, values.command);
            },
            scope: this
        });
        this.hide();
    }

});

/**
 * @class Deluge.ux.AddAutoaddFolderWindow
 * @extends Deluge.ux.AutoaddWindowBase
 */
Deluge.ux.AddAutoaddFolderWindow = Ext.extend(Deluge.ux.AutoaddWindowBase, {

    title: _('Add Command'),

    initComponent: function() {
        Deluge.ux.AddAutoaddFolderWindow.superclass.initComponent.call(this);
        this.addButton(_('Add'), this.onAddClick, this);
        this.addEvents({
            'folderadd': true
        });
    },

    onAddClick: function() {
        var values = this.form.getForm().getFieldValues();
        deluge.client.execute.add_command(values.event, values.command, {
            success: function() {
                this.fireEvent('folderadd', this, values.event, values.command);
            },
            scope: this
        });
        this.hide();
    }

});

Ext.ns('Deluge.ux.preferences');

/**
 * @class Deluge.ux.preferences.AutoaddPage
 * @extends Ext.Panel
 */
Deluge.ux.preferences.AutoaddPage = Ext.extend(Ext.Panel, {

    title: _('AutoAdd'),
    layout: 'fit',
    border: false,

    initComponent: function() {
        Deluge.ux.preferences.AutoaddPage.superclass.initComponent.call(this);

        this.list = new Ext.grid.EditorGridPanel({
            xtype: 'editorgrid',
            autoHeight: true,
            autoExpandColumn: 'path',
            viewConfig: {
                emptyText: _('Loading watch folders...'),
                deferEmptyText: false
            },
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    renderer: function(value, meta, record, rowIndex, colIndex, store) {
                        if (Ext.isNumber(value) && parseInt(value) !== value) {
                            return value.toFixed(6);
                        } else if (Ext.isBoolean(value)) {
                            return '<div class="x-grid3-check-col' + (value ? '-on' : '') +
                                '" style="width: 20px;">&#160;</div>';
                        }
                        return value;
                    }
                },
                columns: [{
                        id: 'active',
                        header: _('Active'),
                        dataIndex: 'active',
                        sortable: true,
                        hideable: false,
                        menuDisabled: true,
                        width: 40
                    },{
                        id: 'owner',
                        header: _('Owner'),
                        dataIndex: 'email',
                        sortable: true,
                        hideable: false
                    },{
                        id: 'path',
                        header: _('Path'),
                        dataIndex: 'path',
                        sortable: true,
                        hideable: false
                    }]
            }),
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: [{
                        name: 'active'
                    },{
                        name: 'owner'
                    },{
                        name: 'path'
                    }]
            }),
            listeners: {
                cellclick: function(grid, rowIndex, colIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    var field = grid.getColumnModel().getDataIndex(colIndex);
                    var value = record.get(field);

                    if (colIndex == 0) {
                        if (Ext.isBoolean(value)) {
                            record.set(field, !value);
                            record.commit();
                        }
                    }
                },
                beforeedit: function(e) {
                    if (Ext.isBoolean(e.value)) {
                        return false;
                    }

                    return e.record.get('active');
                },
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
        });

        this.panel = this.add({
            items: [this.list],
            bbar: {
                items: [{
                        text: _('Add'),
                        iconCls: 'icon-add',
                        handler: this.onAddClick,
                        scope: this
                    }, {
                        text: _('Edit'),
                        iconCls: 'icon-edit',
                        handler: this.onEditClick,
                        scope: this,
                        disabled: true
                    }, '->', {
                        text: _('Remove'),
                        iconCls: 'icon-remove',
                        handler: this.onRemoveClick,
                        scope: this,
                        disabled: true
                    }]
            }
        });

        //this.on('show', this.onPreferencesShow, this);
    },

    onAddClick: function() {
        if (!this.addWin) {
            this.addWin = new Deluge.ux.AddAutoaddFolderWindow();
            this.addWin.on('folderadd', function() {
                this.updateFolders();
            }, this);
        }
        this.addWin.show();
    },

    onDestroy: function() {
        //deluge.preferences.un('show', this.updateConfig, this);

        Deluge.ux.preferences.AutoaddPage.superclass.onDestroy.call(this);
    }

});

Deluge.plugins.AutoaddPlugin = Ext.extend(Deluge.Plugin, {
    name: 'AutoAdd',

    onDisable: function() {
        deluge.preferences.removePage(this.prefsPage);
    },

    onEnable: function() {
        this.prefsPage = deluge.preferences.addPage(new Deluge.ux.preferences.AutoaddPage());
    }
});

Deluge.registerPlugin('AutoAdd', Deluge.plugins.AutoaddPlugin);
