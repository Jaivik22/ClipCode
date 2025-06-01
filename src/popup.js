import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const sendBtn = document.getElementById('sendBtn');
    const receiveBtn = document.getElementById('receiveBtn');
    const backBtnSend = document.getElementById('backBtnSend');
    const backBtnReceive = document.getElementById('backBtnReceive');
    const noteText = document.getElementById('noteText');
    const generateCodeBtn = document.getElementById('generateCodeBtn');
    const generatedCode = document.getElementById('generatedCode');
    const syncCode = document.getElementById('syncCode');
    const getNoteBtn = document.getElementById('getNoteBtn');
    const receivedNote = document.getElementById('receivedNote');
    const sendSection = document.getElementById('sendSection');
    const receiveSection = document.getElementById('receiveSection');
    const buttonContainer = document.getElementById('buttonContainer');
    const charCounter = document.getElementById('charCounter');
    const generateLoader = generateCodeBtn.querySelector('.loader');
    const getNoteLoader = getNoteBtn.querySelector('.loader');

    // Update character counter
    noteText.addEventListener('input', () => {
        const length = noteText.value.length;
        charCounter.textContent = `${length}/500`;
        charCounter.style.color = length > 450 ? '#dc2626' : '#6b7280';
    });

    // Generate unique 6-digit code
    const generateUniqueCode = async () => {
        const db = getFirestore();
        let code;
        let exists = true;
        let attempts = 0;
        const maxAttempts = 10;
        while (exists && attempts < maxAttempts) {
            code = Math.floor(100000 + Math.random() * 900000).toString();
            const docSnap = await getDoc(doc(db, 'notes', code));
            exists = docSnap.exists();
            console.log('exists',exists);
            attempts++;
        }
        if (exists) throw new Error('Unable to generate a unique code. Please try again.');
        return code;
    };

    // Reset to initial screen
    const resetToInitial = () => {
        sendSection.style.display = 'none';
        receiveSection.style.display = 'none';
        buttonContainer.style.display = 'flex';
        noteText.value = '';
        syncCode.value = '';
        generatedCode.textContent = '';
        receivedNote.textContent = '';
        charCounter.textContent = '0/500';
        charCounter.style.color = '#6b7280';
    };

    // Show Send section, hide buttons and Receive section
    sendBtn.addEventListener('click', () => {
        sendSection.style.display = 'block';
        receiveSection.style.display = 'none';
        buttonContainer.style.display = 'none';
    });

    // Show Receive section, hide buttons and Send section
    receiveBtn.addEventListener('click', () => {
        sendSection.style.display = 'none';
        receiveSection.style.display = 'block';
        buttonContainer.style.display = 'none';
    });

    // Back buttons to return to initial screen
    backBtnSend.addEventListener('click', resetToInitial);
    backBtnReceive.addEventListener('click', resetToInitial);

    // Handle Generate Code button click
    generateCodeBtn.addEventListener('click', async () => {
        const text = noteText.value.trim();
        if (!text) {
            generatedCode.innerHTML = '<span class="error">Please write a note to share.</span>';
            return;
        }

        generateCodeBtn.disabled = true;
        generateLoader.classList.remove('hidden');
        try {
            const db = getFirestore();
            const code = await generateUniqueCode();
            await setDoc(doc(db, 'notes', code), { text, createdAt: new Date().toISOString() });
            generatedCode.innerHTML = `<span class="success">Success! Your sync code: <strong>${code}</strong></span>`;
            noteText.value = '';
            charCounter.textContent = '0/500';
            charCounter.style.color = '#6b7280';
        } catch (error) {
            console.log(error.message);
            generatedCode.innerHTML = `<span class="error">Failed to save note: ${error.message}</span>`;
        } finally {
            generateCodeBtn.disabled = false;
            generateLoader.classList.add('hidden');
        }
    });

    // Handle Get Note button click
    getNoteBtn.addEventListener('click', async () => {
        const code = syncCode.value.trim();
        if (!/^\d{6}$/.test(code)) {
            receivedNote.innerHTML = '<span class="error">Please enter a valid 6-digit code.</span>';
            return;
        }

        getNoteBtn.disabled = true;
        getNoteLoader.classList.remove('hidden');
        try {
            const db = getFirestore();
            const docRef = doc(db, 'notes', code);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const noteText = docSnap.data().text;
                receivedNote.innerHTML = `
                    <span class="success">Note: ${noteText}</span>
                    <button id="copyBtn">Copy Note</button>
                `;
                syncCode.value = '';
                // Add event listener for the copy button
                const copyBtn = document.getElementById('copyBtn');
                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(noteText);
                        copyBtn.textContent = 'Copied!';
                        copyBtn.style.backgroundColor = '#16a34a';
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy Note';
                            copyBtn.style.backgroundColor = '#16a34a';
                        }, 2000);
                    } catch (error) {
                        receivedNote.innerHTML += `<br><span class="error">Failed to copy: ${error.message}</span>`;
                    }
                });
            } else {
                receivedNote.innerHTML = '<span class="error">No note found for this code.</span>';
            }
        } catch (error) {
            receivedNote.innerHTML = `<span class="error">Failed to retrieve note: ${error.message}</span>`;
        } finally {
            getNoteBtn.disabled = false;
            getNoteLoader.classList.add('hidden');
        }
    });
});