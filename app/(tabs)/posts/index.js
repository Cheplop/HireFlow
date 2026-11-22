import { useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronDown, ImagePlus, Pencil, Trash2, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../components/common/PrimaryButton';
import { AuthInput } from '../../../components/common/AuthInput';
import SearchRow from '../../../components/common/SearchRow';
import { useAuth } from '../../../contexts/AuthContext';
import { useApplications } from '../../../contexts/ApplicationsContext';
import { useJobs } from '../../../contexts/JobsContext';
import theme from '../../../styles/theme';

const employmentTypes = ['Full-time', 'Part-time', 'Contractual'];
const workModes = ['On-site', 'Remote', 'Hybrid'];
const defaultCompanyLogo = require('../../../assets/images/Hireflow.png');

function resolveImageSource(logo) {
    if (!logo) return defaultCompanyLogo;
    if (typeof logo === 'string') return { uri: logo };
    return logo;
}

// Dropdown styled like AuthInput (used for Employment Type / Work Mode)
function Dropdown({ label, value, options, onChange, placeholder, style }) {
    const [open, setOpen] = useState(false);

    return (
        <View style={[styles.dropdownContainer, style]}>
            <Text style={styles.label}>{label}</Text>

            <Pressable style={styles.dropdownField} onPress={() => setOpen(true)}>
                <Text
                    style={value ? styles.dropdownValue : styles.dropdownPlaceholder}
                    numberOfLines={1}
                >
                    {value || placeholder}
                </Text>
                <ChevronDown size={16} color={theme.fontColor.primary} />
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>{label}</Text>
                        {options.map((option) => (
                            <Pressable
                                key={option}
                                style={[
                                    styles.option,
                                    option === value && styles.optionSelected,
                                ]}
                                onPress={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        option === value && styles.optionTextSelected,
                                    ]}
                                >
                                    {option}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

export default function Posts() {
    const { user } = useAuth();
    const { createJob, updateJob, deleteJob, getJobsForEmployer } = useJobs();
    const { deleteApplicationsForJob } = useApplications();
    const router = useRouter();
    const employerJobs = getJobsForEmployer(user.id);

    const [activeTab, setActiveTab] = useState('manage');
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [companyLogo, setCompanyLogo] = useState(null);
    const [location, setLocation] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [employmentType, setEmploymentType] = useState(employmentTypes[0]);
    const [workMode, setWorkMode] = useState(workModes[0]);
    const [editingJob, setEditingJob] = useState(null);
    const [error, setError] = useState('');

    const filteredJobs = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return employerJobs;
        return employerJobs.filter((job) =>
            [job.jobTitle, job.jobCompany, job.jobLocation]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query)),
        );
    }, [employerJobs, search]);

    async function pickCompanyLogo() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setError('Permission to access your photos is required to upload a logo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setError('');
            setCompanyLogo({ uri: result.assets[0].uri });
        }
    }

    function saveJob() {
        const numericSalary = Number(salary);
        const responsibilityList = responsibilities
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);

        if (!title.trim() || !company.trim() || !description.trim()) {
            setError('Enter a job title, company name, and description.');
            return;
        }

        if (!salary.trim() || !Number.isFinite(numericSalary) || numericSalary < 0) {
            setError('Enter a valid salary.');
            return;
        }

        setError('');
        const jobData = {
            jobTitle: title.trim(),
            jobCompany: company.trim(),
            jobLocation: location.trim(),
            jobDescription: description.trim(),
            responsibilities: responsibilityList,
            salary: numericSalary,
            jobMode: employmentType,
            jobType: workMode,
            companyLogo: companyLogo || defaultCompanyLogo,
        };

        try {
            if (editingJob) {
                updateJob(editingJob.id, user.id, jobData);
            } else {
                createJob(user.id, jobData);
            }
            cancelEditing();
            setActiveTab('manage');
        } catch (saveError) {
            setError(saveError.message);
        }
    }

    function startEditing(job) {
        setEditingJob(job);
        setTitle(job.jobTitle);
        setCompany(job.jobCompany);
        setCompanyLogo(job.companyLogo || null);
        setLocation(job.jobLocation || '');
        setDescription(job.jobDescription || '');
        setResponsibilities((job.responsibilities || []).join('\n'));
        setSalary(String(job.salary ?? ''));
        setEmploymentType(job.jobMode || employmentTypes[0]);
        setWorkMode(job.jobType || workModes[0]);
        setError('');
        setActiveTab('publish');
    }

    function cancelEditing() {
        setEditingJob(null);
        setTitle('');
        setCompany('');
        setCompanyLogo(null);
        setLocation('');
        setDescription('');
        setResponsibilities('');
        setSalary('');
        setEmploymentType(employmentTypes[0]);
        setWorkMode(workModes[0]);
        setError('');
    }

    function handleDelete(job) {
        try {
            deleteApplicationsForJob(job.id, user.id);
            deleteJob(job.id, user.id);
            if (editingJob?.id === job.id) cancelEditing();
            setError('');
        } catch (deleteError) {
            setError(deleteError.message);
        }
    }

    function renderJob({ item }) {
        return (
            <View style={styles.postCard}>
                <View style={styles.postActions}>
                    <Pressable
                        style={styles.postAction}
                        onPress={() => startEditing(item)}
                        hitSlop={8}
                    >
                        <Pencil size={14} color={theme.fontColor.primary} />
                        <Text style={styles.postActionText}>edit</Text>
                    </Pressable>
                    <Pressable
                        style={styles.postAction}
                        onPress={() => handleDelete(item)}
                        hitSlop={8}
                    >
                        <Trash2 size={14} color={theme.fontColor.primary} />
                        <Text style={styles.postActionText}>delete</Text>
                    </Pressable>
                </View>

                <View style={styles.logoBox}>
                    <Image source={resolveImageSource(item.companyLogo)} style={styles.postImage} />
                </View>

                <View style={styles.postInfo}>
                    <Text style={styles.postTitle} numberOfLines={1}>
                        {item.jobTitle}
                    </Text>
                    <Text style={styles.postCompany} numberOfLines={1}>
                        {item.jobCompany}
                    </Text>
                </View>
            </View>
        );
    }

    const isPublishTab = activeTab === 'publish';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={isPublishTab ? [] : filteredJobs}
                keyExtractor={item => String(item.id)}
                renderItem={renderJob}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View>
                        <SearchRow
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search keywords here..."
                            notificationLabel="View notifications"
                            onNotificationPress={() => router.push('/notifications')}
                        />

                        <View style={styles.tabs}>
                            <PrimaryButton
                                title="Manage Jobs"
                                variant={!isPublishTab ? 'active' : 'inactive'}
                                onPress={() => {
                                    if (editingJob) cancelEditing();
                                    setActiveTab('manage');
                                }}
                                style={styles.tabButton}
                            />
                            <PrimaryButton
                                title={editingJob ? 'Edit Job' : 'Publish Jobs'}
                                variant={isPublishTab ? 'active' : 'inactive'}
                                onPress={() => setActiveTab('publish')}
                                style={styles.tabButton}
                            />
                        </View>

                        {isPublishTab ? (
                            <View>
                                <Text style={styles.sectionTitle}>
                                    {editingJob ? 'Edit Job' : 'Publish Jobs'}
                                </Text>

                                {error ? (
                                    <View style={styles.errorBox}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.form}>
                                    <View style={styles.uploadSection}>
                                        <Text style={styles.label}>Company Logo</Text>
                                        <View style={styles.uploadRow}>
                                            <Pressable style={styles.uploadBox} onPress={pickCompanyLogo}>
                                                {companyLogo ? (
                                                    <Image
                                                        source={resolveImageSource(companyLogo)}
                                                        style={styles.uploadedPreview}
                                                    />
                                                ) : (
                                                    <View style={styles.uploadPlaceholder}>
                                                        <ImagePlus size={22} color={theme.fontColor.secondary} />
                                                        <Text style={styles.uploadPlaceholderText}>Upload</Text>
                                                    </View>
                                                )}
                                            </Pressable>

                                            <View style={styles.uploadActions}>
                                                <Pressable style={styles.uploadButton} onPress={pickCompanyLogo}>
                                                    <Text style={styles.uploadButtonText}>
                                                        {companyLogo ? 'Change Logo' : 'Choose Image'}
                                                    </Text>
                                                </Pressable>
                                                {companyLogo ? (
                                                    <Pressable
                                                        style={styles.removeLogoButton}
                                                        onPress={() => setCompanyLogo(null)}
                                                    >
                                                        <X size={14} color="#B42318" />
                                                        <Text style={styles.removeLogoText}>Remove</Text>
                                                    </Pressable>
                                                ) : (
                                                    <Text style={styles.uploadHint}>
                                                        PNG or JPG (defaults to HireFlow logo)
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    <AuthInput
                                        label="Job Title"
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Ex: Frontend Developer"
                                    />

                                    <AuthInput
                                        label="Company name"
                                        value={company}
                                        onChangeText={setCompany}
                                        placeholder="Ex: Google Incorporated"
                                    />

                                    <View style={styles.row}>
                                        <Dropdown
                                            label="Employment Type"
                                            value={employmentType}
                                            options={employmentTypes}
                                            onChange={setEmploymentType}
                                            placeholder="Ex: Full Time"
                                            style={styles.rowItem}
                                        />
                                        <Dropdown
                                            label="Work Mode"
                                            value={workMode}
                                            options={workModes}
                                            onChange={setWorkMode}
                                            placeholder="Ex: Remote"
                                            style={styles.rowItem}
                                        />
                                    </View>

                                    <AuthInput
                                        label="Location"
                                        value={location}
                                        onChangeText={setLocation}
                                        placeholder="Ex: California"
                                    />

                                    <AuthInput
                                        label="Job Description"
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Ex: Add your job description here..."
                                        multiline
                                        textAlignVertical="top"
                                        inputStyle={styles.multilineInput}
                                    />

                                    <AuthInput
                                        label="Responsibilities"
                                        value={responsibilities}
                                        onChangeText={setResponsibilities}
                                        placeholder="Add each responsibility on a new line"
                                        multiline
                                        textAlignVertical="top"
                                        inputStyle={styles.responsibilitiesInput}
                                    />

                                    <AuthInput
                                        label="Salary"
                                        value={salary}
                                        onChangeText={setSalary}
                                        placeholder="Enter salary"
                                        keyboardType="decimal-pad"
                                    />

                                    <PrimaryButton
                                        title={editingJob ? 'Save Changes' : 'Publish Job'}
                                        onPress={saveJob}
                                        style={styles.publishButton}
                                    />

                                    {editingJob ? (
                                        <PrimaryButton
                                            title="Cancel Editing"
                                            variant="secondary"
                                            onPress={() => {
                                                cancelEditing();
                                                setActiveTab('manage');
                                            }}
                                            style={styles.cancelButton}
                                        />
                                    ) : null}
                                </View>
                            </View>
                        ) : (
                            <View>
                                <View style={styles.listHeading}>
                                    <View style={styles.listHeadingText} />
                                    <Text style={styles.jobCount}>
                                        {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
                                    </Text>
                                </View>
                                {error ? (
                                    <Text style={styles.listError}>{error}</Text>
                                ) : null}
                            </View>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    isPublishTab ? null : (
                        <Text style={styles.emptyText}>
                            {employerJobs.length
                                ? 'No jobs match your search.'
                                : 'No jobs yet. Publish your first listing.'}
                        </Text>
                    )
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 20,
    },

    listContent: {
        paddingHorizontal: 2,
        paddingTop: 2,
        paddingBottom: 130, // clears the floating tab bar
    },

    /* Tabs: same chips as the Home filters */
    tabs: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: theme.spacing.medium,
    },

    tabButton: {
        width: 'auto',
        minWidth: 84,
        height: 34,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 17,
        borderColor: theme.colors.border,
    },

    /* Headings */
    sectionTitle: {
        fontSize: theme.fontSize.large,
        fontWeight: theme.fontWeight.bold,
        color: theme.fontColor.primary,
    },

    listHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: theme.spacing.small,
    },

    listHeadingText: {
        flex: 1,
    },

    jobCount: {
        fontSize: theme.fontSize.small,
        color: theme.fontColor.secondary,
        marginTop: 4,
    },

    listError: {
        color: theme.actions.deletePrimary,
        fontSize: theme.fontSize.small,
        paddingBottom: theme.spacing.small,
    },

    /* Form */
    form: {
        paddingTop: 13,
        marginBottom: theme.spacing.medium,
    },

    /* Company Logo Upload */
    uploadSection: {
        marginBottom: 16,
    },

    uploadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    uploadBox: {
        width: 72,
        height: 72,
        borderRadius: 14,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'black',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    uploadedPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    uploadPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },

    uploadPlaceholderText: {
        fontSize: 11,
        color: theme.fontColor.secondary,
        fontWeight: '600',
    },

    uploadActions: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 6,
    },

    uploadButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#FFFFFF',
    },

    uploadButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#112033',
    },

    uploadHint: {
        fontSize: 12,
        color: theme.fontColor.secondary,
    },

    removeLogoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    removeLogoText: {
        fontSize: 12,
        color: '#B42318',
        fontWeight: '600',
    },

    multilineInput: {
        minHeight: 120,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 15,
        lineHeight: 22,
    },

    responsibilitiesInput: {
        minHeight: 160,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 15,
        lineHeight: 24,
    },

    label: {
        color: '#1d1f22',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    rowItem: {
        flex: 1,
    },

    publishButton: {
        marginTop: 4,
    },

    cancelButton: {
        marginTop: 12,
    },

    errorBox: {
        backgroundColor: '#FFF0F0',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F2CCCC',
        marginBottom: theme.spacing.medium,
    },

    errorText: {
        color: '#B42318',
        fontSize: 13,
    },

    /* Dropdown */
    dropdownContainer: {
        marginBottom: 16,
    },

    dropdownField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },

    dropdownValue: {
        flex: 1,
        fontSize: 15,
        color: '#112033',
    },

    dropdownPlaceholder: {
        flex: 1,
        fontSize: 15,
        color: '#abb0b7',
    },

    backdrop: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        backgroundColor: theme.colors.overlay,
    },

    sheet: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.radius.medium,
        padding: theme.spacing.medium,
        gap: 8,
    },

    sheetTitle: {
        color: theme.fontColor.primary,
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.bold,
        marginBottom: 4,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: theme.colors.mutedBackground,
    },

    optionSelected: {
        backgroundColor: theme.colors.primary,
    },

    optionText: {
        color: theme.fontColor.primary,
        fontSize: theme.fontSize.medium,
    },

    optionTextSelected: {
        color: '#FFFFFF',
        fontWeight: theme.fontWeight.bold,
    },

    /* Job card (same look as the Home ApplyCard) */
    postCard: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.medium,
        padding: 12,
        borderRadius: theme.radius.large,
        backgroundColor: theme.colors.cardBackground,
        boxShadow: theme.boxShadow.default,
    },

    postActions: {
        position: 'absolute',
        top: 10,
        right: 16,
        flexDirection: 'row',
        gap: 12,
    },

    postAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    postActionText: {
        fontSize: theme.fontSize.small,
        color: theme.fontColor.primary,
    },

    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: theme.colors.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: theme.boxShadow.default,
        overflow: 'hidden',
    },

    postImage: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },

    postInfo: {
        flex: 1,
        minWidth: 0,
        gap: 2,
        marginTop: 14,
    },

    postTitle: {
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.bold,
        color: theme.fontColor.primary,
    },

    postCompany: {
        fontSize: theme.fontSize.small,
        color: theme.fontColor.primary,
    },

    separator: {
        height: 14,
    },

    emptyText: {
        textAlign: 'center',
        color: theme.fontColor.secondary,
        paddingVertical: 25,
    },
});