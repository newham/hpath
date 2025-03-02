const { ipcRenderer } = require('electron');

async function loadZProfile() {
    const content = await ipcRenderer.invoke('read-zprofile');
    if (content) {
        const lines = content.split('\n');
        const envLines = [];
        const commandType = [];
        const envName = [];
        const envValue = [];
        const comment = [];
        const singleLineInput = [];
        const originalData = {}; // 新增：用于保存每个索引的原始数据

        lines.forEach((line, index) => {
            envLines.push(line);
            if (line.startsWith('#')) {
                commandType[index] = 'comment';
                comment[index] = line.slice(1).trim();
            } else {
                const commentIndex = line.indexOf('#');
                let commandPart = line;
                if (commentIndex > -1) {
                    commandPart = line.slice(0, commentIndex).trim();
                    comment[index] = line.slice(commentIndex + 1).trim();
                } else {
                    comment[index] = '';
                }

                const firstSpaceIndex = commandPart.indexOf(' ');
                if (firstSpaceIndex > -1) {
                    commandType[index] = commandPart.slice(0, firstSpaceIndex);
                    const restOfCommand = commandPart.slice(firstSpaceIndex + 1);
                    const equalSignIndex = restOfCommand.indexOf('=');
                    if (equalSignIndex > -1) {
                        envName[index] = restOfCommand.slice(0, equalSignIndex);
                        envValue[index] = restOfCommand.slice(equalSignIndex + 1);
                    } else {
                        singleLineInput[index] = restOfCommand;
                        commandType[index] = 'others';
                    }
                }
            }
            // 保存每个索引的原始数据
            originalData[index] = {
                commandType: commandType[index],
                envName: envName[index],
                envValue: envValue[index],
                comment: comment[index]
            };
        });

        // 创建 Vue 实例
        new Vue({
            el: '#app',
            data: {
                envLines: envLines,
                commandType: commandType,
                envName: envName,
                envValue: envValue,
                comment: comment,
                singleLineInput: singleLineInput,
                editingIndex: null,
                originalLine: '',
                originalData: originalData // 新增：在 Vue 实例中使用原始数据
            },
            computed: {
                isDataChanged() {
                    // 检查每个数组是否有变化
                    for (let i = 0; i < this.envLines.length; i++) {
                        if (
                            this.envLines[i] !== this.originalData[i]?.envLines ||
                            this.commandType[i] !== this.originalData[i]?.commandType ||
                            this.envName[i] !== this.originalData[i]?.envName ||
                            this.envValue[i] !== this.originalData[i]?.envValue ||
                            this.comment[i] !== this.originalData[i]?.comment ||
                            this.singleLineInput[i] !== this.originalData[i]?.singleLineInput
                        ) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            methods: {
                isComment(line) {
                    return line.startsWith('#');
                },
                editLine(index) {
                    this.editingIndex = index;
                    this.originalLine = this.envLines[index];
                },
                saveLine(index) {
                    if (this.commandType[index] === 'comment') {
                        this.envLines[index] = `#${this.comment[index]}`;
                    } else if (this.commandType[index] === 'export' || this.commandType[index] === 'alias') {
                        let newLine;
                        if (!this.envName[index]) {
                            newLine = `${this.commandType[index] || ''} ${this.envValue[index] || ''}`;
                        } else {
                            let envValueToUse = this.envValue[index];
                            if (this.commandType[index] === 'alias' && !envValueToUse.startsWith("'") && !envValueToUse.endsWith("'")) {
                                envValueToUse = `'${envValueToUse}'`;
                            }
                            newLine = `${this.commandType[index] || ''} ${this.envName[index] || ''}=${envValueToUse}`;
                        }
                        if (this.comment[index]) {
                            newLine += ` #${this.comment[index]}`;
                        }
                        this.envLines[index] = newLine.trim();
                    } else if (this.commandType[index] === 'others') {
                        this.envLines[index] = this.envLines[index].trim();
                    }
                    this.editingIndex = null;
                },
                cancelEdit(index) {
                    // 恢复原始行文本
                    this.envLines[index] = this.originalLine;
                    // 恢复原始的 commandType、envName、envValue 和 comment
                    this.commandType[index] = this.originalData[index].commandType;
                    this.envName[index] = this.originalData[index].envName;
                    this.envValue[index] = this.originalData[index].envValue;
                    this.comment[index] = this.originalData[index].comment;
                    console.log('Original line restored:', this.envLines[index]);
                    // 退出编辑状态
                    this.editingIndex = null;
                    console.log('Editing index set to null:', this.editingIndex);
                    // 强制更新 DOM
                    this.$forceUpdate();
                },
                addLine() {
                    const newIndex = this.envLines.length;
                    this.envLines.push('');
                    this.commandType[newIndex] = 'export';
                    this.envName[newIndex] = '';
                    this.envValue[newIndex] = '';
                    this.comment[newIndex] = '';
                    this.singleLineInput[newIndex] = '';
                    // 保存新增行的原始数据
                    this.originalData[newIndex] = {
                        commandType: 'export',
                        envName: '',
                        envValue: '',
                        comment: ''
                    };
                    this.editingIndex = newIndex;
                },
                addLineBelow(index) {
                    const newIndex = index + 1;
                    this.envLines.splice(newIndex, 0, '');
                    this.commandType.splice(newIndex, 0, 'export');
                    this.envName.splice(newIndex, 0, '');
                    this.envValue.splice(newIndex, 0, '');
                    this.comment.splice(newIndex, 0, '');
                    this.singleLineInput.splice(newIndex, 0, '');
                    // 保存新增行的原始数据
                    this.originalData[newIndex] = {
                        commandType: 'export',
                        envName: '',
                        envValue: '',
                        comment: ''
                    };
                    this.editingIndex = newIndex;
                },
                deleteLine(index) {
                    this.envLines.splice(index, 1);
                    this.commandType.splice(index, 1);
                    this.envName.splice(index, 1);
                    this.envValue.splice(index, 1);
                    this.comment.splice(index, 1);
                    this.singleLineInput.splice(index, 1);
                    // 删除对应索引的原始数据
                    delete this.originalData[index];
                    this.editingIndex = null;
                },
                saveAll() {
                    let content = this.envLines.join('\n');
                    ipcRenderer.invoke('write-zprofile', content).then(success => {
                        if (success) {
                            alert('Saved .zprofile successfully!');
                        }
                    });
                    // 保存成功后更新原始数据
                    Object.keys(this.originalData).forEach(index => {
                        this.originalData[index] = {
                            commandType: this.commandType[index],
                            envName: this.envName[index],
                            envValue: this.envValue[index],
                            comment: this.comment[index]
                        };
                    });
                }
            }
        });
    }
}

loadZProfile();
